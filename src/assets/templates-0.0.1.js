angular.module('templates', ['com/topnav.tpl.html', 'home/home.tpl.html']);

angular.module("com/topnav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("com/topnav.tpl.html",
    "<header class=\"navbar navbar-fixed-top navbar-default cm-navbar\">\n" +
    "  <div class=\"container\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li class=\"dropdown\">\n" +
    "          <a class=\"dropdown-toggle\" href=\"#\">\n" +
    "            <span class=\"glyphicon glyphicon-th-list\"></span>\n" +
    "            <span class=\"caret\"></span>\n" +
    "          </a>\n" +
    "          <ul class=\"dropdown-menu\">\n" +
    "            <li><a ui-sref=\"home\">Blank Project</a></li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li><a href=\"/login\">Login</a></li>\n" +
    "            <li><a href=\"/register\">Register</a></li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "\n" +
    "        <li class=\"{{isActive('packages')}}\">\n" +
    "          <a ui-sref=\"home\">\n" +
    "            <span class=\"glyphicon glyphicon-home\"></span>\n" +
    "            <span>Home</span>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav\" ui-view=\"toolbar\"></ul>\n" +
    "      <ul class=\"nav navbar-nav pull-right\" ui-view=\"toolbar-right\"></ul>\n" +
    "  </div>\n" +
    "</header>\n" +
    "<div style=\"height:60px\"></div>\n" +
    "");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "{{text}}\n" +
    "");
}]);
