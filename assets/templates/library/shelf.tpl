<% include ../header.tpl %>
<scroller id="Library-Shelf">
    <items>
        <shelf id="Library-Shelf-<%- params.serverId %>" columnCount="5">
            <sections>
                <shelfSection>
                    <items>
                    <% items.forEach(function(item, index){ %>
                        <sixteenByNinePoster id="<%- index %>" showOutline="false" alwaysShowTitles="true"
                            onSelect="atv.loadURL('<%=: [params.serverId, item.CollectionType.toLowerCase(), item.Id] | buildUrl %>');"
                            onPlay="atv.loadURL('<%=: [params.serverId, item.CollectionType.toLowerCase(), item.Id] | buildUrl %>');">
                            <title><%= item.Name %></title>
                            <subtitle>&#x00AD;</subtitle>
                            <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                            <defaultImage>resource://16x9.png</defaultImage>
                        </sixteenByNinePoster>
                    <% }); %>
                    </items>
                </shelfSection>
            </sections>
        </shelf>
        
        <%
        function latestList(type, colCount, posterType, defaultImage, imageType, imageHeight) {
            posterType = posterType || "movie";
            imageType = imageType || "Primary";
            defaultImage = defaultImage || "Poster";
            imageHeight = imageHeight || 384;
            
            var filtered = items.filter(function(i) { return i.CollectionType === type; });
            
            if (filtered && filtered[0].length !== 0) {
        %>
        <collectionDivider alignment="left" accessibilityLabel="<%= __('label.latest.' + type) %>">
            <title><%= __('label.latest.' + type) %></title>
        </collectionDivider>
        <shelf id="Library-Shelf-Newest-<%- type %>" columnCount="<%- colCount || 5 %>">
            <sections>
                <shelfSection>
                    <items>
                    <% filtered[0].latestItems.forEach(function(item, index) {%>
                        <<%- posterType %>Poster id="latests-<%- item.Type + '_' + index %>" showOutline="false" alwaysShowTitles="true"
                            onSelect="atv.loadURL('<%=: [params.serverId, type, filtered[0].Id, item.Type.toLowerCase(), item.Id] | buildUrl:{seriesId: item.SeriesId, seasonId: item.ParentId} %>');"
                            onPlay="atv.loadURL('<%=: [params.serverId, type, filtered[0].Id, item.Type.toLowerCase(), item.Id, 'play'] | buildUrl %>');">
                            <title><%=: item | title %></title>
                            <subtitle><%=: item | subtitle %></subtitle>
                            <% if (item.Type === 'Episode') { %>
                            <image><%=: item.ParentThumbItemId | imageUrl:imageType,imageHeight %></image>
                            <% }%>
                            <% if (item.Type !== 'Episode') { %>
                            <image><%=: item.Id | imageUrl:imageType,imageHeight %></image>
                            <% }%>
                            <defaultImage>resource://<%- defaultImage %>.png</defaultImage>
                        </<%- posterType %>Poster>
                    <% }); %>
                    </items>
                </shelfSection>
            </sections>
        </shelf>
        <% }} %>
        <% latestList("movies", 8) %>
        <% latestList("music", 5, "square", "Square") %>
        <% latestList("tvshows", 5, "sixteenByNine", "16x9", "Thumb", 240) %>
    </items>
</scroller>
<% include ../footer.tpl %>