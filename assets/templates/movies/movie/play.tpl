<% include ../../shared/header.tpl %>
<videoPlayer id="Video-Player">
    <httpFileVideoAsset id="<%- item.Id %>">
        <mediaURL><%=: item | streamUrl %></mediaURL>
        <title><%= item.Name %></title>
        <description><%= item.Overview %></description>
        <image><%=: item.Id | imageUrl:'Primary',800 %></image>
        <% if (item.UserData.PlaybackPositionTicks > 0) { %>
        <bookmarkTime><%- item.UserData.PlaybackPositionTicks / 10000000 %></bookmarkTime>
        <% } %>
        
        <metadata>
            <serverId><%- params.serverId %></serverId>
            <mediaSourceId><%- item.Id %></mediaSourceId>
        </metadata>
    </httpFileVideoAsset>
</videoPlayer>
<% include ../../shared/footer.tpl %>