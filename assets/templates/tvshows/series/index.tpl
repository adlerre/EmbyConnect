<% include ../../header.tpl %>
    <itemDetail id="Series-Details">
      <title><%= item.Name %></title>
      <subtitle><%=: item.Taglines[0] | extractText %></subtitle>
      <rightImage required="true"><%=: item.Id | imageUrl:'Logo',40 %></rightImage>
      <rating><%=: item.OfficialRating | extractText %></rating>
      <summary><%= item.Overview %></summary>
      <image style="moviePoster"><%=: item.Id | imageUrl:'Primary',768 %></image>
      <defaultImage>resource://Poster.png</defaultImage>
      <% if (item.Studios.length > 0) { %>
      <footnote>© <%= item.Studios[0].Name %>, All Rights Reserved.</footnote>
      <% } %>
      <table>
        <columnDefinitions>
          <columnDefinition width="50" alignment="left">
            <title><%= __("label.details") %></title>
          </columnDefinition>
          <columnDefinition width="50" alignment="left">
            <title><%=: item.People | people:'Actor',5 | length | i18nN:'label.actors' %></title>
          </columnDefinition>
        </columnDefinitions>
        <rows>
          <row>
            <label><%=: item.Genres | join:', ' %></label>
            <label><%=: item.People | people:'Actor',5 | get:0 | extractText %></label>
          </row>
          <row>
            <label><%=: item.ProductionYear | extractText %></label>
            <label><%=: item.People | people:'Actor',5 | get:1 | extractText %></label>
          </row>
          <row>
            <label />
            <label><%=: item.People | people:'Actor',5 | get:2 | extractText %></label>
          </row>
          <row>
            <starRating>
              <percentage><%- item.CommunityRating * 10 %></percentage>
            </starRating>
            <label><%=: item.People | people:'Actor',5 | get:3 | extractText %></label>
          </row>
          <row>
            <label />
            <label><%=: item.People | people:'Actor',5 | get:4 | extractText %></label>
          </row>
        </rows>
      </table>
      
      <% if (items.length > 0) { %>
      <divider>
        <smallCollectionDivider alignment="left" accessibilityLabel="<%= __n('label.seasons', items.length) %>">
          <title><%= __n('label.seasons', items.length) %></title>
        </smallCollectionDivider>
      </divider>
      <bottomShelf>
        <shelf id="bottomShelf" columnCount="8">
          <sections>
            <shelfSection>
              <items>
                <% items.forEach(function(season, index) { %>
                <moviePoster id="shelf_season_<%- index %>" alwaysShowTitles="true" accessibilityLabel="<%= season.IndexNumber === 0 ? __('label.special') : __n('season %s', season.IndexNumber) %>" related="true" 
                    onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, season.Type.toLowerCase(), season.Id] | buildUrl:{seriesId: item.Id} %>');" 
                    onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, season.Type.toLowerCase(), season.Id] | buildUrl:{seriesId: item.Id} %>');">
                  <title><%= season.IndexNumber === 0 ? __('label.special') : __n('season %s', season.IndexNumber) %></title>
                  <image><%=: season.Id | imageUrl:'Primary',384 %></image>
                  <defaultImage>resource://Poster.png</defaultImage>
                </moviePoster>
                <% }) %>
              </items>
            </shelfSection>
          </sections>
        </shelf>
      </bottomShelf>
      <% } %>
      
      <moreInfo>
        <listScrollerSplit id="com.sample.list-scroller-split">
          <menu>
            <sections>
            
              <% if (item.GenreItems.length !== 0) { %>
              <menuSection>
                <header>
                  <textDivider alignment="left" accessibilityLabel="<%=: item.GenreItems | length | i18nN:'label.genres' %>">
                    <title><%=: item.GenreItems | length | i18nN:'label.genres' %></title>
                  </textDivider>
                </header>
                <items>
                  <% item.GenreItems.forEach(function(g, index) { %>
                  <oneLineMenuItem id="genre_<%- index %>" accessibilityLabel="<%= g.Name %>">
                    <label><%= g.Name %></label>
                    <preview>
                      <link><%=: ["genre", g.Id, "preview"] | buildUrl %></link>
                    </preview>
                  </oneLineMenuItem>
                  <% }) %>
                </items>
              </menuSection>
              <% } %>
              
              <% 
              function personList(personType, i18n) {
                 var persons = item.People.filter(function(i) { return i.Type === personType; });
                 if (persons.length !== 0) {
              %>
                  <menuSection>
                    <header>
                      <textDivider alignment="left" accessibilityLabel="<%=: __n(i18n, persons.length) %>">
                        <title><%=: __n(i18n, persons.length) %></title>
                      </textDivider>
                    </header>
                    <items>
                    <%  persons.forEach(function(p, index) { %>
                      <twoLineMenuItem id="<%- personType + '_' + index %>" accessibilityLabel="<%= p.Name %>">
                        <label><%= p.Name %></label>
                        <label2><%= p.Role %></label2>
                        <image><%=: p.Id | imageUrl:'Primary',80 %></image>
                        <defaultImage>resource://Poster.png</defaultImage>
                        <preview>
                          <link><%=: [params.serverId, params.libType, params.libId, "person", p.Id, "preview"] | buildUrl:{"includeItemTypes" : params.itemType} %></link>
                        </preview>
                      </twoLineMenuItem>
                    <% }) %>
                    </items>
                  </menuSection>
              <%  }
              } %>
              
              <% personList('Actor', 'label.actors') %>
              <% personList('Director', 'label.directors') %>
              <% personList('Producer', 'label.producers') %>
              <% personList('Writer', 'label.writers') %>
              
            </sections>
          </menu>
        </listScrollerSplit>
      </moreInfo>
    </itemDetail>
<% include ../../footer.tpl %>