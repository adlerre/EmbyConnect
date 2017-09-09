<% include ../shared/header.tpl %>
<scroller id="movie-shelf-recommendations">
  <items>
    <collectionDivider alignment="left" accessibilityLabel="<%= __('label.resumeWatch') %>">
      <title><%= __('label.resumeWatch') %></title>
    </collectionDivider>
    <shelf id="shelf_resumables" columnCount="8">
      <sections>
        <shelfSection>
          <items>
            <% resumable.forEach(function(item, index) { %>
            <moviePoster id="shelf_resume_item_<%- index %>" accessibilityLabel="<%= item.Name %>" showOutline="true" alwaysShowTitles="true"
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');">
              <title><%=: item | title %></title>
              <subtitle><%=: item | subtitle %></subtitle>
              <image><%=: item.Id | imageUrl:'Primary',240 %></image>
              <defaultImage>resource://Poster.png</defaultImage>
            </moviePoster>
            <% }) %>
          </items>
        </shelfSection>
      </sections>
    </shelf>
    <collectionDivider alignment="left" accessibilityLabel="<%= __('label.latest.movies') %>">
      <title><%= __('label.latest.movies') %></title>
    </collectionDivider>
    <shelf id="shelf_latest" columnCount="8">
      <sections>
        <shelfSection>
          <items>
            <% latest.forEach(function(item, index) { %>
            <moviePoster id="shelf_next_item_<%- index %>" accessibilityLabel="<%= item.Name %>" showOutline="true" alwaysShowTitles="true"
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id, 'play'] | buildUrl %>');">
              <title><%=: item | title %></title>
              <subtitle><%=: item | subtitle %></subtitle>
              <image><%=: item.Id | imageUrl:'Primary',240 %></image>
              <defaultImage>resource://Poster.png</defaultImage>
            </moviePoster>
            <% }) %>
          </items>
        </shelfSection>
      </sections>
    </shelf>
  </items>
</scroller>
<% include ../shared/footer.tpl %>