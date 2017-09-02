<% include ../header.tpl %>
    <preview>
        <longDescriptionPreview>
            <title><%= item.Name %></title>
            <summary><%= item.Overview %></summary>
            <image><%=: item.Id | imageUrl:'Primary',768 %></image>
            <metadata>
                <% if (item.PremiereDate) { %>
                <label><%= __("label.dateOfBirth") %>: <%=: item.PremiereDate | formatDate %></label>
                <% } %>
                <% if (item.ProductionLocations) { %>
                <label><%= __("label.placeOfBirth") %>: <%=: item.ProductionLocations | get:0 %></label>
                <% } %>
            </metadata>
        </longDescriptionPreview>
    </preview>
<% include ../footer.tpl %>