<% include ../shared/header.tpl %>
    <preview>
        <scrollerPreview id="Person-moreInfoPreview">
        <header>
          <metadataHeader>
            <title><%= item.Name %></title>
            <subtitle><%=: relatedItems.length | i18nN:'%s ' + query.includeItemTypes %></subtitle>
          </metadataHeader>
        </header>
        <items>
          <grid id="grid_0" columnCount="6">
            <items>
                <% relatedItems.forEach(function(item, index) { %>
                <moviePoster id="item_<%- index %>" accessibilityLabel="<%= item.Name %>" related="true" 
                    onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                    onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');">
                  <title><%=: item | title %></title>
                  <subtitle><%=: item | subtitle %></subtitle>
                  <image><%=: item.Id | imageUrl:'Primary' %></image>
                  <defaultImage>resource://Poster.png</defaultImage>
                </moviePoster>
                <% }) %>
            </items>
          </grid>
        </items>
      </scrollerPreview>
    </preview>
<% include ../shared/footer.tpl %>