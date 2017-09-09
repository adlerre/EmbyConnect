<% include ../header.tpl %>
<scroller id="tv-shelf-newest">
  <items>
    <collectionDivider alignment="left" accessibilityLabel="<%= __('label.resumeWatch') %>">
      <title><%= __('label.resumeWatch') %></title>
    </collectionDivider>
    <shelf id="shelf_resumables" columnCount="5">
      <sections>
        <shelfSection>
          <items>
            <% resumable.forEach(function(item, index) { %>
            <sixteenByNinePoster id="shelf_resume_item_<%- index %>" accessibilityLabel="<%= item.Name %>" showOutline="true" alwaysShowTitles="true"
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');">
              <title><%=: item | title %></title>
              <subtitle><%=: item | subtitle %></subtitle>
              <image><%=: item.ParentThumbItemId | imageUrl:'Thumb',240 %></image>
              <defaultImage>resource://16X9.png</defaultImage>
            </sixteenByNinePoster>
            <% }) %>
          </items>
        </shelfSection>
      </sections>
    </shelf>
    <collectionDivider alignment="left" accessibilityLabel="<%= __('label.nextUp') %>">
      <title><%= __('label.nextUp') %></title>
    </collectionDivider>
    <shelf id="shelf_nextUp" columnCount="5">
      <sections>
        <shelfSection>
          <items>
            <% next.forEach(function(item, index) { %>
            <sixteenByNinePoster id="shelf_next_item_<%- index %>" accessibilityLabel="<%= item.Name %>" showOutline="true" alwaysShowTitles="true"
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id, 'play'] | buildUrl %>');">
              <title><%=: item | title %></title>
              <subtitle><%=: item | subtitle %></subtitle>
              <image><%=: item.ParentThumbItemId | imageUrl:'Thumb',240 %></image>
              <defaultImage>resource://16X9.png</defaultImage>
            </sixteenByNinePoster>
            <% }) %>
          </items>
        </shelfSection>
      </sections>
    </shelf>
  </items>
</scroller>
<% include ../footer.tpl %>