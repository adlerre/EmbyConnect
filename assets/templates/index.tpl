<atv>
    <head>
      <script src="<%=: ['js/logger.js'] | buildUrl %>" />
      <script src="<%=: ['js/utils.js'] | buildUrl %>" />
      <script src="<%=: ['js/navbar.js'] | buildUrl %>" />
    </head>
    <body>
        <viewWithNavigationBar id="EmbyConnect-Nav" volatile="true"
            onNavigate="loadMenuPage(event)" onVolatileReload="reloadNavbar(event)">
          <navigation currentIndex="0">
            <% if (serverId) { %>
            <navigationItem id="library">
              <title><%= __("library.other") %></title>
              <url><%=: [serverId, "library"] | buildUrl %></url>
            </navigationItem>
            <% } %>
            <navigationItem id="settings">
              <title><%= __("label.settings") %></title>
              <url><%=: ['settings'] | buildUrl %></url>
            </navigationItem>
          </navigation>
        </viewWithNavigationBar>
<% include shared/footer.tpl %>