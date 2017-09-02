<% include ../header.tpl %>
    <viewWithNavigationBar id="EmbyConnect_Navigation">
            <navigation currentIndex="0">
                <navigationItem id="allShows">
                    <title><%= __('label.allShows') %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'grid'] | buildUrl %></url>
                </navigationItem>
                <navigationItem id="newest">
                    <title><%= __('label.newest') %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'newest'] | buildUrl %></url>
                </navigationItem>
                <navigationItem id="genres">
                    <title><%= __n('label.genres', 2) %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'genres'] | buildUrl %></url>
                </navigationItem>
            </navigation>
        </viewWithNavigationBar>
<% include ../footer.tpl %>