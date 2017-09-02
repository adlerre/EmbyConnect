<% include ../header.tpl %>
    <scroller id="tv-shelf-genres">
      <items>
        <% items.forEach(function(genre, index) { %>
        <collectionDivider alignment="left" accessibilityLabel="<%= genre.Name %>">
          <title><%= genre.Name %></title>
        </collectionDivider>
        <shelf id="shelf_<%- index %>" columnCount="8">
          <sections>
            <shelfSection>
              <items>
                <% genre.Items.forEach(function(item, index) { %>
                <squarePoster id="shelf_item_<%- index %>" accessibilityLabel="<%= item.Name %>" showOutline="false" alwaysShowTitles="true"
                    onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                    onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');">
                  <title><%= item.Name %></title>
                  <subtitle>&#x00AD;</subtitle>
                  <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                  <defaultImage>resource://Poster.png</defaultImage>
                </squarePoster>
                <% }) %>
              </items>
            </shelfSection>
          </sections>
        </shelf>
        <% }) %>
      </items>
    </scroller>
<% include ../footer.tpl %>