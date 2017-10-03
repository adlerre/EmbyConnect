<% include ../../shared/header.tpl %>
    <mediaBrowser id="browser" gridLayout="mixed">
      <header>
        <headerWithCountAndButtons>
          <title><%= item.Name %></title>
          <count><%- items.length %></count>
          <buttons>
            <actionButton id="slideshow" onSelect="onSlideShow()" onPlay="onSlideShow()">
              <title><%=: __('action.slideshow') %></title>
            </actionButton>
          </buttons>
        </headerWithCountAndButtons>
      </header>
      
      <items>
        <% items.forEach(function(item) { %>
        <photo id="<%- item.Id %>" onSelect="onSelectPhoto('<%- item.Id %>')">
          <caption><%= item.Name %></caption>
          <assets>
            <photoAsset width="0" height="0" src="<%=: item.Id | imageUrl:'Primary',384 %>"/>
          </assets>
        </photo>
        <% }) %>
      </items>
    </mediaBrowser>
<% include ../../shared/footer.tpl %>