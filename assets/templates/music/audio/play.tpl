<% include ../../shared/header.tpl %>
<audioPlayer id="com.sample.audio-player" startPlaybackAtIndex="0">
  <httpFileAudioAsset id="<%- item.Id %>">
    <mediaURL><%=: item | streamUrl %></mediaURL>
    <title><%= item.Name %></title>
    <artist><%= item.AlbumArtist %></artist>
    <collection><%= item.Album %></collection>
    <image><%=: item.AlbumId | imageUrl:'Primary',800 %></image>
    <% if (item.UserData.PlaybackPositionTicks > 0) { %>
    <bookmarkTime><%- item.UserData.PlaybackPositionTicks / 10000000 %></bookmarkTime>
    <% } %>
        
    <metadata>
        <serverId><%- params.serverId %></serverId>
        <mediaSourceId><%- item.Id %></mediaSourceId>
    </metadata>
  </httpFileAudioAsset>
</audioPlayer>
<% include ../../shared/footer.tpl %>