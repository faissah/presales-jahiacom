import org.jahia.api.Constants
import org.jahia.services.SpringContextSingleton
import org.jahia.services.content.JCRCallback
import org.jahia.services.content.JCRNodeWrapper
import org.jahia.services.content.JCRPublicationService
import org.jahia.services.content.JCRSessionWrapper
import org.jahia.services.content.JCRTemplate
import org.jahia.services.content.JCRValueWrapper
import org.jahia.services.content.PublicationInfo
import org.jahia.services.seo.VanityUrl
import org.jahia.services.seo.jcr.VanityUrlManager
import org.jahia.services.sites.JahiaSite
import org.jahia.taglibs.jcr.node.JCRTagUtils
import java.text.Normalizer

import javax.jcr.NodeIterator
import javax.jcr.RepositoryException
import javax.jcr.query.Query

//boolean doIt = false;

// set to true to run this script to add vanityUrls on files
boolean executeOnFiles = false;

// set to true to run this script to add vanityUrls on content
boolean executeOnContent = true;

// list of languages to ignore
Set<String> langToIgnore = new HashSet<String>();
langToIgnore.add("es");

// list of path to ignore for any reason...
Set<String> pathToIgnore = new HashSet<String>();
pathToIgnore.add("/sites/www/home/blog/blog-archives");
pathToIgnore.add("/sites/www/home/landing-pages");


// Choose a files firectory prefix. Could be "/files" or "/static" or "" for instance
String FILES_PREFIX  = "/static";

// list of file extention to handle
Set<String> fileExtentions = new HashSet<String>();
fileExtentions.add("pdf");
fileExtentions.add("doc");
fileExtentions.add("docx");
fileExtentions.add("jpg");
fileExtentions.add("gif");
fileExtentions.add("png");

// enf of configutation
// ----------------------------------------------------------------------------
Set<String> nodesToAutoPublish = new HashSet<String>();
Set<String> vanityNodesToAutoPublish = new HashSet<String>();
Set<String> nodesToManuelPublish = new HashSet<String>();


Collection contentTypes = new HashSet<String>();

def logger = log;

def JahiaSite site = org.jahia.services.sites.JahiaSitesService.getInstance().getSiteByKey("www");
if (site != null) {
    for (Locale locale : site.getLanguagesAsLocales()) {

        if (langToIgnore.contains(locale.toString())) {
            continue;
        }

        JCRTemplate.getInstance().doExecuteWithSystemSession(null, Constants.EDIT_WORKSPACE, locale, new JCRCallback() {
            @Override
            Object doInJCR(JCRSessionWrapper session) throws RepositoryException {
                VanityUrlManager urlMgr = SpringContextSingleton.getInstance().getContext().getBean(VanityUrlManager.class);

                if (executeOnContent){
                    String stmt = "select * from [jnt:contentTemplate]";
                    NodeIterator iterator = session.getWorkspace().getQueryManager().createQuery(stmt, Query.JCR_SQL2).execute().getNodes();
                    while (iterator.hasNext()) {
                        final JCRNodeWrapper contentTemplateNode = (JCRNodeWrapper) iterator.nextNode();
                        if (contentTemplateNode.hasProperty('j:applyOn')) {
                            for (JCRValueWrapper  valueWrapper : contentTemplateNode.getProperty('j:applyOn').getValues()) {
                                String contentType = valueWrapper .getString();
                                contentTypes.add(contentType);
                            }
                        }
                    }

                    // remove unwanted types
                    contentTypes.remove("jnt:content");
                    contentTypes.remove("jnt:contentFolder");
                    contentTypes.remove("jnt:file");
                    contentTypes.remove("jnt:folder");
                    contentTypes.remove("jnt:globalSettings");
                    contentTypes.remove("jnt:module");
                    contentTypes.remove("jnt:nodeType");
                    contentTypes.remove("jnt:topic");
                    contentTypes.remove("jnt:user");
                    contentTypes.remove("jnt:vfsMountPointFactoryPage");
                    contentTypes.remove("jnt:virtualsite");
                    contentTypes.remove("fcnt:form");
                    contentTypes.remove("wemnt:optimizationTest");
                    contentTypes.remove("wemnt:personalizedContent");

                    // add wanted types
                    contentTypes.add("jnt:page");

                    Iterator contentTypeIterator = contentTypes.iterator();
                    while(contentTypeIterator.hasNext()){
                        String contentType = contentTypeIterator.next();
                        logger.info(contentType);


                        stmt = "select * from [" + contentType + "] where isdescendantnode('" + site.getJCRLocalPath() + "/home')";
                        //logger.info(stmt);
                        iterator = session.getWorkspace().getQueryManager().createQuery(stmt, Query.JCR_SQL2).execute().getNodes();
                        while (iterator.hasNext()) {
                            final JCRNodeWrapper page = (JCRNodeWrapper) iterator.nextNode();
                            String pagePath = page.getPath();
                            Iterator ignorPathIterator = pathToIgnore.iterator();
                            boolean ignorePath = false;
                            while(ignorPathIterator.hasNext()) {
                                String singlePathToIgnore = ignorPathIterator.next();
                                if (pagePath.startsWith(singlePathToIgnore)) {
                                    ignorePath = true;
                                }
                            }
                            //logger.info("Create vanity for " + page.getPath());
                            if (! ignorePath) {


                                children = JCRTagUtils.getParentsOfType(page,'jmix:navMenuItem');
                                String url = "/" + slug(page.getDisplayableName());
                                if (page.isNodeType('jnt:fixApplier')) {
                                    String fromVersion = page.getPropertyAsString('from');
                                    String toVersion = page.getPropertyAsString('to');
                                    url = "/" + slug(fromVersion + "_" + toVersion);
                                }
                                children.eachWithIndex() { parentPage, index ->
                                    if (parentPage != null) {
                                        if (index !=  children.size()-1) {
                                            String pageTitle = parentPage.getDisplayableName();
                                            if (pageTitle != null) {
                                                String slugTitle = slug(pageTitle);
                                                url = "/" + slugTitle + url;
                                            }
                                        }
                                    }
                                }
                                if (! "en".equals(locale.toString())) {
                                    url = "/${locale.toString()}${url}"
                                }

                                //logger.info(" -> " + url);

                                if(urlMgr.findExistingVanityUrls(url,site.getSiteKey(),session).isEmpty()) {
                                    VanityUrl vanityUrl = new VanityUrl(url, site.getSiteKey(),locale.toString(),true,true);
                                    if (doIt) {
                                        try {
                                            urlMgr.saveVanityUrlMapping(page,vanityUrl,session);
                                        } catch (org.jahia.services.seo.jcr.NonUniqueUrlMappingException uniq) {
                                            logger.info(uniq.getMessage());
                                        } catch (java.lang.NullPointerException npe) {
                                            logger.info(npe.getMessage());
                                        }

                                    }
                                    logger.info("    [" + locale.toString() + "] [" + contentType + "] " + page.getPath() + " [" + url + "]");
                                    if (hasPendingModification(page)) {
                                        nodesToManuelPublish.add(page.identifier);
                                    } else {
                                        nodesToAutoPublish.add(page.identifier);
                                        try {
                                            JCRNodeWrapper vanityUrlMappingNode = session.getNode(page.getPath() + "/vanityUrlMapping");
                                            if (vanityUrlMappingNode != null) {
                                                for (JCRNodeWrapper vanityURlNode : JCRContentUtils.getChildrenOfType(vanityUrlMappingNode, "jnt:vanityUrl")) {
                                                    vanityNodesToAutoPublish.add(vanityURlNode.identifier);
                                                }
                                            }
                                        } catch (javax.jcr.PathNotFoundException e) {
                                            logger.info(e.getMessage());
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
                if (executeOnFiles){
                    // now on files, only for PDF in english yet
                    if ("en".equals(locale.toString())) {
                        String stmt = "select * from [jnt:file] where isdescendantnode('" + site.getJCRLocalPath() + "/files')";
                        iterator = session.getWorkspace().getQueryManager().createQuery(stmt, Query.JCR_SQL2).execute().getNodes();
                        while (iterator.hasNext()) {
                            final JCRNodeWrapper file = (JCRNodeWrapper) iterator.nextNode();
                            String filePath = file.getPath();
                            if (! pathToIgnore.contains(filePath)) {
                                Iterator<Integer> iterator = fileExtentions.iterator();
                                while(iterator.hasNext()) {
                                    String fileExtention = iterator.next();
                                    if (filePath.toLowerCase(Locale.ENGLISH).endsWith("." + fileExtention.toLowerCase(Locale.ENGLISH))) {
                                        String[] parts = filePath.replaceAll(site.getJCRLocalPath() + "/files/", "").split("/");
                                        String url = FILES_PREFIX;
                                        for(String part : parts) {
                                            String slugTitle = slugFile(part);
                                            url = url + "/" + slugTitle;
                                        }
                                        try {
                                            if (urlMgr.findExistingVanityUrls(url, site.getSiteKey(), session).isEmpty()) {
                                                VanityUrl vanityUrl = new VanityUrl(url, site.getSiteKey(), locale.toString(), true, true);
                                                if (doIt) {
                                                    urlMgr.saveVanityUrlMapping(file, vanityUrl, session);
                                                }
                                                logger.info("    [" + locale.toString() + "] " + file.getPath() + " [" + url + "]");
                                                //if (hasPendingModification(file)) {
                                                //    nodesToManuelPublish.add(file.identifier);
                                                //} else {
                                                nodesToAutoPublish.add(file.identifier);
                                                try {
                                                    JCRNodeWrapper vanityUrlMappingNode = session.getNode(file.getPath() + "/vanityUrlMapping");
                                                    if (vanityUrlMappingNode != null) {
                                                        for (JCRNodeWrapper vanityURlNode : JCRContentUtils.getChildrenOfType(vanityUrlMappingNode, "jnt:vanityUrl")) {
                                                            vanityNodesToAutoPublish.add(vanityURlNode.identifier);
                                                        }
                                                    }
                                                } catch (javax.jcr.PathNotFoundException e) {
                                                    logger.info(e.getMessage());
                                                }
                                                //}
                                            }
                                        } catch (org.jahia.services.seo.jcr.NonUniqueUrlMappingException xxx) {
                                            logger.info(xxx.getMessage());
                                        }

                                    }
                                }

                            }
                        }
                    }
                }
                if (CollectionUtils.isNotEmpty(nodesToAutoPublish)) {
                    if (doIt) {
                        //JCRPublicationService.getInstance().publish(nodesToAutoPublish.asList(), Constants.EDIT_WORKSPACE, Constants.LIVE_WORKSPACE, false, null)
                        //JCRPublicationService.getInstance().publish(vanityNodesToAutoPublish.asList(), Constants.EDIT_WORKSPACE, Constants.LIVE_WORKSPACE, false, null)
                    };
                    logger.info("");
                    logger.info("Nodes which where republished:")
                    for (String identifier : nodesToAutoPublish) {
                        logger.warn("   " + session.getNodeByIdentifier(identifier).getPath());
                    }
                }
                if (CollectionUtils.isNotEmpty(nodesToManuelPublish)) {

                    logger.info("");
                    logger.info("Nodes publish manually:")
                    for (String identifier : nodesToManuelPublish) {
                        logger.warn("   " + identifier + " " + session.getNodeByIdentifier(identifier).getPath()) + "/vanityUrlMapping/*";
                    }
                }
                if (doIt) {
                    session.save();
                }
                return null;
            }
        });
        logger.info("End of add-seo script");
    }
}

public boolean hasPendingModification(final JCRNodeWrapper node) throws RepositoryException {
    try {
        if (!Constants.EDIT_WORKSPACE.equals(node.getSession().getWorkspace().getName())) {
            throw new IllegalArgumentException("The node has to be accessed through a session opened on the default workspace");
        }
        return JCRTemplate.getInstance().doExecuteWithSystemSession(null, Constants.LIVE_WORKSPACE, null, new JCRCallback<Boolean>() {
            public Boolean doInJCR(JCRSessionWrapper session) throws RepositoryException {
                int status = JCRPublicationService.getInstance().getStatus(node, session, null);
                if (status == null) {
                    status = PublicationInfo.UNPUBLISHED;
                }
                return PublicationInfo.PUBLISHED != status;
            }
        });
    } catch (Exception e) {
        return false;
    }
}
public String slug(final String str) {
    if (str == null) {
        return "";
    }
    return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").replaceAll("[^ \\w|.]", "").trim().replaceAll("\\s+", "-").toLowerCase(Locale.ENGLISH)
}
public String slugFile(final String str) {
    if (str == null) {
        return "";
    }
    return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").replaceAll("[^ \\w|.|-]", "").trim().replaceAll("\\s+", "_").replaceAll("\\-+", "-").replaceAll("\\_+", "_").replaceAll("_-_","-").toLowerCase(Locale.ENGLISH);
}
