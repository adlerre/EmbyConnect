<% include shared/header.tpl %>
<viewWithNavigationBar id="EmbyConnect-Nav" volatile="true">
  <navigation currentIndex="0">
    <navigationItem id="library">
      <title><%= __("library.other") %></title>
      <url><%=: (serverId ? [serverId, "library"] : ["library"]) | buildUrl %></url>
    </navigationItem>
    <navigationItem id="settings">
      <title><%= __("label.settings") %></title>
      <url><%=: ['settings'] | buildUrl %></url>
    </navigationItem>
  </navigation>
</viewWithNavigationBar>
<% include shared/footer.tpl %>