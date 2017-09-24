<% include ../shared/header.tpl %>
    <preview>
        <scrollerPreview id="Genre-moreInfoPreview">
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
                <<%=: item | posterType %> id="item_<%- index %>" showOutline="false" alwaysShowTitles="true"
                    onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');"
                    onPlay="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');"
                    onHoldSelect="atvutils.popUpMenu('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>')">
                    <title><%= item.Name %></title>
                    <subtitle>&#x00AD;</subtitle>
                    <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                    <defaultImage>resource://Poster.png</defaultImage>
                </<%=: item | posterType %>>
                <% }) %>
            </items>
          </grid>
        </items>
      </scrollerPreview>
    </preview>
<% include ../shared/footer.tpl %>