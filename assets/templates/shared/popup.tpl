<% include header.tpl %>
    <popUpMenu id="popupMenu">
      <sections>
        <menuSection>
          <items>
              <oneLineMenuItem id="list_0" accessibilityLabel="<%= __('popup.markWatched') %>" onSelect="emby.markWatched('<%- params.serverId %>', '<%- params.libType %>', '<%- params.libId %>', '<%- item.Type.toLowerCase() %>', '<%- item.Id %>'); atv.unloadPage();">
                <label><%= __('popup.markWatched') %></label>
              </oneLineMenuItem>
              <oneLineMenuItem id="list_1" accessibilityLabel="<%= __('popup.markUnwatched') %>" onSelect="emby.markUnwatched('<%- params.serverId %>', '<%- params.libType %>', '<%- params.libId %>', '<%- item.Type.toLowerCase() %>', '<%- item.Id %>'); atv.unloadPage();">
                <label><%= __('popup.markUnwatched') %></label>
              </oneLineMenuItem>
          </items>
        </menuSection>
      </sections> 
    </popUpMenu>
<% include footer.tpl %>