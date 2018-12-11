<% include ../../shared/header.tpl %>
    <itemDetail id="Episode-Details">
      <title><%- item.IndexNumber%>. <%= item.Name %></title>
      <subtitle><%= item.SeriesName %>, <%= __n('season %s', item.ParentIndexNumber)%></subtitle>
      <rightImage required="false"><%=: item.ParentLogoItemId | imageUrl:'Logo',40 %></rightImage>
      <rating><%=: item.OfficialRating | extractText %></rating>
      <summary><%= item.Overview %></summary>
      <image style="moviePoster"><%=: item.ParentId | imageUrl:'Primary',768 %></image>
      <defaultImage>resource://Poster.png</defaultImage>
      <% if (item.SeriesStudio) { %>
      <footnote>© <%= item.SeriesStudio %>, All Rights Reserved.</footnote>
      <% } %>
      <table>
        <columnDefinitions>
          <columnDefinition width="50" />
        </columnDefinitions>
        <rows>
          <row>
            <label><%= __('label.released') %>: <%=: item.PremiereDate | formatDate %></label>
          </row>
          <row>
            <label><%=: item.RunTimeTicks | convertTicksToMinutes | i18nN:'%s mins' %></label>
          </row>
          <row>
            <mediaBadges>
            <% if (item.IsHD) { %><videoFormat>HD</videoFormat><% } %>
            <% if (item.HasSubtitles) { %><closedCaption /><% } %>
            </mediaBadges>
          </row>
          <row>
            <starRating>
              <percentage><%- (item.CommunityRating || 0) * 10 %></percentage>
            </starRating>
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
                  onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id, "play"] | buildUrl %>');">
                  <title><%= __("label.play") %></title>
                  <image>resource://Play.png</image>
                  <focusedImage>resource://PlayFocused.png</focusedImage>
                  <!--<badge>HD</badge>-->
                </actionButton>
              </items>
            </shelfSection>
          </sections>
        </shelf>
      </centerShelf>
      
      <% if (items.length > 0) { %>
      <divider>
        <smallCollectionDivider alignment="left" accessibilityLabel="<%= __n('label.seasons', items.length) %>">
          <title><%= __n('label.seasons', items.length) %></title>
        </smallCollectionDivider>
      </divider>
      <bottomShelf>
        <shelf id="bottomShelf" columnCount="5">
          <sections>
            <shelfSection>
              <items>
                <% items.forEach(function(episode, index) { %>
                <sixteenByNinePoster id="shelf_epsiode_<%- index %>" alwaysShowTitles="true" accessibilityLabel="<%= episode.Name %>" related="true" 
                    onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, episode.Type.toLowerCase(), episode.Id] | buildUrl:{seriesId: item.SeriesId, seasonId: item.Id} %>');" 
                    onPlay="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, episode.Type.toLowerCase(), episode.Id, "play"] | buildUrl:{seriesId: item.SeriesId, seasonId: item.Id} %>');">
                  <title><%= episode.Name %></title>
                  <image><%=: episode.Id | imageUrl:'Primary',384 %></image>
                  <defaultImage>resource://16x9.png</defaultImage>
                </sixteenByNinePoster>
                <% }) %>
              </items>
            </shelfSection>
          </sections>
        </shelf>
      </bottomShelf>
      <% } %>
    </itemDetail>
<% include ../../shared/footer.tpl %>