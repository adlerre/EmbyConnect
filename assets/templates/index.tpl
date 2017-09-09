<% include shared/header.tpl %>
<viewWithNavigationBar id="EmbyConnect-Nav" volatile="true">
  <navigation currentIndex="0">
    <navigationItem id="library">
      <title><%= __("library.other") %></title>
      <url><%=: (servers.length === 1 ? [servers[0].Id, "library"] : ["library"]) | buildUrl %></url>
    </navigationItem>
    <navigationItem id="settings">
      <title><%= __("label.settings") %></title>
      <url><%=: ['settings'] | buildUrl %></url>
    </navigationItem>
  </navigation>
</viewWithNavigationBar>
<% include shared/footer.tpl %>