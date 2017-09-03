<% include ../../header.tpl %>
    <listWithPreview id="menu-items-with-sections">
      <header>
        <simpleHeader accessibilityLabel="<%= item.Name %>">
          <title><%= item.Name %></title>
        </simpleHeader>
      </header>
      <menu>
        <sections>
          <menuSection>
            <items>
              <% items.forEach(function(track, index) { %>
              <oneLineMenuItem id="track_<%- index %>" 
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, track.Type.toLowerCase(), track.Id] | buildUrl %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, track.Type.toLowerCase(), track.Id, "play"] | buildUrl %>');">
                <label><%= track.Name %></label>
                <rightLabel><%=: track.RunTimeTicks | convertTicksToTime %></rightLabel>
                <ordinal><%- track.IndexNumber %></ordinal>
                <maxOrdinalDigits><%- item.ChildCount.toString().length %></maxOrdinalDigits>
                <accessories>
                    <% if (!track.UserData.Played && track.UserData.PlayCount === 0) { %><unplayedDot /><% } %>
                    <% if (!track.UserData.Played && track.UserData.PlayCount > 0) { %><partiallyPlayedDot /><% } %>
                </accessories>
                <preview>
                  <keyedPreview>
                    <title><%= track.Name %></title>
                    <image><%=: track.ParentId | imageUrl:'Primary',800 %></image>
                    <summary>&#x00AD;</summary>
                    <% if (track.Studios.length !== 0) { %>
                    <footnote>© <%= track.Studios[0] %>, All Rights Reserved.</footnote>
                    <% } %>
                    <metadataKeys>
                        <label><%= __('label.album') %></label>
                        <label><%= __('label.artist') %></label>
                        <label><%= __n('label.genres', item.Genres.length) %></label>
                        <label><%= __('label.length') %></label>
                    </metadataKeys>
                    <metadataValues>
                        <label><%= item.Name %></label>
                        <label><%= item.AlbumArtist %></label>
                        <label><%=: item.Genres | join:',' %></label>
                        <label><%=: track.RunTimeTicks | convertTicksToTime %></label>
                    </metadataValues>
                  </keyedPreview>
                </preview>
              </oneLineMenuItem>
              <% }) %>
            </items>
          </menuSection>
        </sections>
      </menu>
    </listWithPreview>
<% include ../../footer.tpl %>