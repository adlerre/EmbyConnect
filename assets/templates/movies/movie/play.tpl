<% include ../../header.tpl %>
<videoPlayer id="Video-Player">
    <httpFileVideoAsset id="<%- item.Id %>">
        <mediaURL><%=: item | streamUrl %></mediaURL>
        <title><%= item.Name %></title>
        <description><%= item.Overview %></description>
        <image><%=: item.Id | imageUrl:'Thumb',384 %></image>
    </httpFileVideoAsset>
</videoPlayer>
<% include ../../footer.tpl %>