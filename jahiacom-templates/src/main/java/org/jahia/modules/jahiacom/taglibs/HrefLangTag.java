package org.jahia.modules.jahiacom.taglibs;

import org.jahia.taglibs.AbstractJahiaTag;
import org.jahia.utils.LanguageCodeConverters;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.Locale;

/**
 * Created by pol on 13/07/2020.
 */
public class HrefLangTag extends AbstractJahiaTag {

    private static final transient Logger logger = org.slf4j.LoggerFactory.getLogger(HrefLangTag.class);

    private String languageCode;
    public String getLanguageCode() {
        return languageCode;
    }
    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public int doStartTag() {
        try {
            final String currentLocale = getCurrentResource().getLocale().getLanguage();
            if (!currentLocale.equals(languageCode)) {
                final String url = generateCurrentNodeLangSwitchLink(languageCode);
                pageContext.getOut().print(url);
            }
        } catch (IOException e) {
            logger.error("Error while getting language switch URL", e);
        }
        return SKIP_BODY;
    }
}
