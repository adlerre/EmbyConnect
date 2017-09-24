<% include ../../shared/header.tpl %>
    <itemDetail id="Movie-Details">
      <title><%= item.Name %> <% if (item.ProductionYear) {%>(<%= item.ProductionYear %>)<% } %></title>
      <subtitle><%=: item.Taglines[0] | extractText %></subtitle>
      <rightImage required="false"><%=: item.Id | imageUrl:'Logo',40 %></rightImage>
      <rating><%=: item.OfficialRating | extractText %></rating>
      <summary><%= item.Overview || "" %></summary>
      <image style="moviePoster"><%=: item.Id | imageUrl:'Primary',768 %></image>
      <defaultImage>resource://Poster.png</defaultImage>
      <% if (item.Studios.length > 0) { %>
      <footnote>© <%= item.Studios[0].Name %>, All Rights Reserved.</footnote>
      <% } %>
      <table>
        <columnDefinitions>
          <columnDefinition width="25" alignment="left">
            <title><%= __("label.details") %></title>
          </columnDefinition>
          <columnDefinition width="25" alignment="left">
            <title><%=: item.People | people:'Actor',5 | length | i18nN:'label.actors' %></title>
          </columnDefinition>
          <columnDefinition width="25" alignment="left">
            <title><%=: item.People | people:'Director',5 | length | i18nN:'label.directors' %></title>
          </columnDefinition>
          <columnDefinition width="25" alignment="left">
            <title><%=: item.People | people:'Producer',5 | length | i18nN:'label.producers' %></title>
          </columnDefinition>
        </columnDefinitions>
        <rows>
          <row>
            <label><%=: item.Genres | join:', ' %></label>
            <label><%=: item.People | people:'Actor',5 | get:0 | extractText %></label>
            <label><%=: item.People | people:'Director',5 | get:0 | extractText %></label>
            <label><%=: item.People | people:'Producer',5 | get:0 | extractText %></label>
          </row>
          <row>
            <label><%=: item.ProductionYear | extractText %></label>
            <label><%=: item.People | people:'Actor',5 | get:1 | extractText %></label>
            <label><%=: item.People | people:'Director',5 | get:1 | extractText %></label>
            <label><%=: item.People | people:'Producer',5 | get:1 | extractText %></label>
          </row>
          <row>
            <label><%=: item.RunTimeTicks | convertTicksToMinutes | i18nN:'%s mins' %></label>
            <label><%=: item.People | people:'Actor',5 | get:2 | extractText %></label>
            <label><%=: item.People | people:'Director',5 | get:2 | extractText %></label>
            <label><%=: item.People | people:'Producer',5 | get:2 | extractText %></label>
          </row>
          <row>
            <starRating>
              <percentage><%- item.CommunityRating * 10 %></percentage>
            </starRating>
            <label><%=: item.People | people:'Actor',5 | get:3 | extractText %></label>
            <label><%=: item.People | people:'Director',5 | get:3 | extractText %></label>
            <label><%=: item.People | people:'Producer',5 | get:3 | extractText %></label>
          </row>
          <row>
            <mediaBadges>
                <% if (item.IsHD) { %><videoFormat>HD</videoFormat><% } %>
                <% if (item.MediaSources && "AC3|DTS".indexOf(item.MediaSources[0].Name.split("/")[2]) !== -1) { %>
                <audioFormat>dolbyDigital</audioFormat>
                <% } %>
                <% if (item.HasSubtitles) { %><closedCaption /><% } %>
            </mediaBadges>
            <label><%=: item.People | people:'Actor',5 | get:4 | extractText %></label>
            <label><%=: item.People | people:'Director',5 | get:4 | extractText %></label>
            <label><%=: item.People | people:'Producer',5 | get:4 | extractText %></label>
          </row>
        </rows>
      </table>
      <centerShelf>
        <shelf id="centerShelf" columnCount="4" center="true">
          <sections>
            <shelfSection>
              <stash>
                <% function streamInfo(type) {
                    var streams = item.MediaStreams.filter(function(i) { return i.Type === type; });
                %>
                    <% streams.forEach(function(stream, index) { %>
                    <stream>
                      <language><%=: stream.Language | language %></language>
                      <codec><%= stream.Codec %></codec>
                      <streamType><%= stream.Type %></streamType>
                      <displayTitle><%= stream.DisplayTitle %></displayTitle>
                    </stream>
                    <% }) %>
                <% } %>
                <% streamInfo("Video"); %>
                <% streamInfo("Audio"); %>
                <% streamInfo("Subtitle"); %>
              </stash>
              <items>
                <actionButton id="play" accessibilityLabel="<%= __('label.play') %>" 
                    onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, params.itemType, item.Id, "play"] | buildUrl %>');">
                  <title><%= __("label.play") %></title>
                  <image>resource://Play.png</image>
                  <focusedImage>resource://PlayFocused.png</focusedImage>
                  <!--<badge>HD</badge>-->
                </actionButton>
                <actionButton id="more" accessibilityLabel="<%= __('label.more') %>" onSelect="atv.showMoreInfo();">
                  <title><%= __("label.more") %></title>
                  <image>resource://More.png</image>
                  <focusedImage>resource://MoreFocused.png</focusedImage>
                </actionButton>
              </items>
            </shelfSection>
          </sections>
        </shelf>
      </centerShelf>
      
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
                    onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, params.itemType, item.Id] | buildUrl %>');" 
                    onPlay="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, params.itemType, item.Id] | buildUrl %>');">
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
      
      <% if (item.GenreItems.length !== 0 || item.People.length !== 0) { %>
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
                  <oneLineMenuItem id="genre_<%- index %>" accessibilityLabel="<%: g.Name %>">
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
      <% } %>
    </itemDetail>
<% include ../../shared/footer.tpl %>