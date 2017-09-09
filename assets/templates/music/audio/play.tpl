<% include ../../shared/header.tpl %>
<audioPlayer id="com.sample.audio-player" startPlaybackAtIndex="0">
  <httpFileAudioAsset id="<%- item.Id %>">
    <mediaURL><%=: item | streamUrl %></mediaURL>
    <title><%= item.Name %></title>
    <artist><%= item.AlbumArtist %></artist>
    <collection><%= item.Album %></collection>
    <image><%=: item.ParentId | imageUrl:'Primary',384 %></image>
  </httpFileAudioAsset>
</audioPlayer>
<% include ../../shared/footer.tpl %>