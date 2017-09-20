<% include ../shared/header.tpl %>
    <itemDetail id="Person-Details">
      <title><%= item.Name %></title>
      <summary><%= item.Overview %></summary>
      <image style="moviePoster"><%=: item.Id | imageUrl:'Primary',768 %></image>
      <defaultImage>resource://Poster.png</defaultImage>
      
      <% if (items.length > 0) { %>
      <divider>
        <smallCollectionDivider alignment="left" accessibilityLabel="<%= __('label.similar') %>">
          <title><%= __('label.similar') %></title>
        </smallCollectionDivider>
      </divider>
      <bottomShelf>
        <shelf id="bottomShelf" columnCount="8">
          <sections>
            <shelfSection>
              <items>
                <% items.forEach(function(item, index) { %>
                <moviePoster id="shelf_item_<%- index %>" accessibilityLabel="<%= item.Name %>" related="true" 
                    onSelect="atvutils.loadURL('<%=: [type, item.Id] | buildUrl %>');" onPlay="atvutils.loadURL('<%=: [type, item.Id] | buildUrl %>');">
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
<% include ../shared/footer.tpl %>