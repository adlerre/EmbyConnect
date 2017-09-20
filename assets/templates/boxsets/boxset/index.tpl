<% include ../../shared/header.tpl %>
    <itemDetail id="Collection-Details">
      <title><%= item.Name %> <% if (item.ProductionYear) {%>(<%= item.ProductionYear %>)<% } %></title>
      <subtitle><%=: item.Taglines[0] | extractText %></subtitle>
      <rightImage required="true"><%=: item.Id | imageUrl:'Logo',40 %></rightImage>
      <rating><%=: item.OfficialRating | extractText %></rating>
      <summary><%= item.Overview %></summary>
      <image style="moviePoster"><%=: item.Id | imageUrl:'Primary',768 %></image>
      <defaultImage>resource://Poster.png</defaultImage>
      
      <% if (items.length > 0) { %>
      <divider>
        <smallCollectionDivider alignment="left" accessibilityLabel="<%= __n('label.movies', items.length) %>">
          <title><%= __n('label.movies', items.length) %></title>
        </smallCollectionDivider>
      </divider>
      <bottomShelf>
        <shelf id="bottomShelf" columnCount="8">
          <sections>
            <shelfSection>
              <items>
                <% items.forEach(function(item, index) { %>
                <moviePoster id="shelf_item_<%- index %>" accessibilityLabel="<%= item.Name %>" related="true" 
                    onSelect="atvutils.loadURL('<%=: [params.serverId, 'movies', params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');" 
                    onPlay="atvutils.loadURL('<%=: [params.serverId, 'movies', params.libId, item.Type.toLowerCase(), item.Id, 'play'] | buildUrl %>');">
                  <title><%= item.Name %></title>
                  <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                  <defaultImage>resource://Poster.png</defaultImage>
                </moviePoster>
                <% }) %>
              </items>
            </shelfSection>
          </sections>
        </shelf>
      </bottomShelf>
      <% } %>
    </itemDetail>
<% include ../../shared/footer.tpl %>