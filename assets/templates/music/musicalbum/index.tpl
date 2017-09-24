<% include ../../shared/header.tpl %>
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
                onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type, item.Id, "play"] | buildUrl:{index: index} %>');" 
                onPlay="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type, item.Id, "play"] | buildUrl:{index: index} %>');">
                <label><%= track.Name %></label>
                <rightLabel><%=: track.RunTimeTicks | convertTicksToTime %></rightLabel>
                <ordinal><%- track.IndexNumber || index + 1 %></ordinal>
                <maxOrdinalDigits><%- item.ChildCount.toString().length %></maxOrdinalDigits>
                <accessories>
                    <% if (!track.UserData.Played && track.UserData.PlayCount === 0) { %><unplayedDot /><% } %>
                    <% if (!track.UserData.Played && track.UserData.PlayCount > 0) { %><partiallyPlayedDot /><% } %>
                </accessories>
                <preview>
                  <keyedPreview>
                    <title><%= track.Name %></title>
                    <image><%=: track.AlbumId | imageUrl:'Primary',800 %></image>
                    <% if (item.Overview) { %>
                    <summary><%= item.Overview %></summary>
                    <% } else { %>
                    <summary/>
                    <% } %>
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
<% include ../../shared/footer.tpl %>