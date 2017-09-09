<% include ../header.tpl %>
    <viewWithNavigationBar id="EmbyConnect_Navigation">
            <navigation currentIndex="0">
                <navigationItem id="allShows">
                    <title><%= __('label.allMovies') %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'grid'] | buildUrl %></url>
                </navigationItem>
                <navigationItem id="newest">
                    <title><%= __('label.recommendations') %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'recommendations'] | buildUrl %></url>
                </navigationItem>
                <navigationItem id="genres">
                    <title><%= __n('label.genres', 2) %></title>
                    <url><%=: [params.serverId, params.libType, params.libId, 'genres'] | buildUrl %></url>
                </navigationItem>
            </navigation>
        </viewWithNavigationBar>
<% include ../footer.tpl %>