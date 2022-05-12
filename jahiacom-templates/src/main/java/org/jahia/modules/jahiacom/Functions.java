package org.jahia.modules.jahiacom;

public final class Functions {

    private Functions() {
        //
    }

    public static String replaceAll(String string, String pattern, String replacement) {
        return string.replaceAll(pattern, replacement);
    }

}
