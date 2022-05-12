package org.jahia.modules.jahiacom.initializers;
import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.ValueImpl;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.jahia.services.content.nodetypes.renderer.AbstractChoiceListRenderer;
import org.jahia.services.content.nodetypes.renderer.ModuleChoiceListRenderer;
import org.jahia.services.render.RenderContext;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.*;

@Component(name = "jahiacomResourceTypesInitializer", service = ModuleChoiceListInitializer.class, immediate = true)
public class JahiacomResourceTypesInitializer extends AbstractChoiceListRenderer implements ModuleChoiceListInitializer, ModuleChoiceListRenderer {

    private static final Logger logger = LoggerFactory.getLogger(JahiacomResourceTypesInitializer.class);

    private String key = "jahiacomResourceTypesInitializer";

    /**
     * {@inheritDoc}
     */
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values,
                                                     Locale locale, Map<String, Object> context) {

        //Create the list of ChoiceListValue to return
        List<ChoiceListValue> myChoiceList = new ArrayList<ChoiceListValue>();

        if (context == null) {
            return myChoiceList;
        }

        HashMap<String, Object> myPropertiesMap = null;



        // analystReport
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:analystReport");
        myChoiceList.add(new ChoiceListValue("analystReport",myPropertiesMap,new ValueImpl("analystReport", PropertyType.STRING, false)));

        // documentation
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:documentation");
        myChoiceList.add(new ChoiceListValue("documentation",myPropertiesMap,new ValueImpl("documentation", PropertyType.STRING, false)));

        // downloads
        myPropertiesMap = new HashMap<String, Object>();
        //myPropertiesMap.put("addMixin","jcmix:documentation");
        myChoiceList.add(new ChoiceListValue("downloads",myPropertiesMap,new ValueImpl("downloads", PropertyType.STRING, false)));

        // event
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:event");
        myChoiceList.add(new ChoiceListValue("event",myPropertiesMap,new ValueImpl("event", PropertyType.STRING, false)));

        // job
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:job");
        myChoiceList.add(new ChoiceListValue("job",myPropertiesMap,new ValueImpl("job", PropertyType.STRING, false)));

        // successStory
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:successStory");
        myChoiceList.add(new ChoiceListValue("successStory",myPropertiesMap,new ValueImpl("successStory", PropertyType.STRING, false)));

        // product
        myPropertiesMap = new HashMap<String, Object>();
        myChoiceList.add(new ChoiceListValue("product",myPropertiesMap,new ValueImpl("product", PropertyType.STRING, false)));

        // training
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:training");
        myChoiceList.add(new ChoiceListValue("training",myPropertiesMap,new ValueImpl("training", PropertyType.STRING, false)));

        // whitePaper
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","jcmix:whitePaper");
        myChoiceList.add(new ChoiceListValue("whitePaper",myPropertiesMap,new ValueImpl("whitePaper", PropertyType.STRING, false)));

        // news
        myPropertiesMap = new HashMap<String, Object>();
        //myPropertiesMap.put("addMixin","jcmix:whitePaper");
        myChoiceList.add(new ChoiceListValue("news",myPropertiesMap,new ValueImpl("news", PropertyType.STRING, false)));


        //Return the list
        return myChoiceList;
    }

    /**
     * {@inheritDoc}
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * {@inheritDoc}
     */
    public String getKey() {
        return key;
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(RenderContext context, JCRPropertyWrapper propertyWrapper) throws RepositoryException {
        final StringBuilder sb = new StringBuilder();

        if (propertyWrapper.isMultiple()) {
            sb.append('{');
            final Value[] values = propertyWrapper.getValues();
            for (Value value : values) {
                sb.append('[').append(value.getString()).append(']');
            }
            sb.append('}');
        } else {
            sb.append('[').append(propertyWrapper.getValue().getString()).append(']');
        }

        return sb.toString();
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(Locale locale, ExtendedPropertyDefinition propDef, Object propertyValue) throws RepositoryException {
        return "[" + propertyValue.toString() + "]";
    }
}
