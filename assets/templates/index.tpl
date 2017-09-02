<% include header.tpl %>
<viewWithNavigationBar id="EmbyConnect-Nav" volatile="true">
  <navigation currentIndex="0">
    <navigationItem id="library">
      <title><%= __("library.other") %></title>
      <url><%=: [serverId, "library"] | buildUrl %></url>
    </navigationItem>
    <navigationItem id="settings">
      <title><%= __("label.settings") %></title>
      <url><%=: ['settings'] | buildUrl %></url>
    </navigationItem>
  </navigation>
</viewWithNavigationBar>
<% include footer.tpl %>