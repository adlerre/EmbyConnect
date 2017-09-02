<% include ../../header.tpl %>
    <listWithPreview id="menu-items-with-sections">
      <header>
        <simpleHeader accessibilityLabel="<%= item.SeriesName %>">
          <title><%= item.SeriesName %></title>
          <subtitle><%= item.IndexNumber === 0 ? __('label.special') : __n('season %s', item.IndexNumber) %></subtitle>
        </simpleHeader>
      </header>
      <menu>
        <sections>
          <menuSection>
            <items>
              <!--
              <oneLineMenuItem id="seasons" accessibilityLabel="<%= __('label.otherSeasons') %>" onSelect="atv.loadURL('<%=: ['series', item.ParentId] | buildUrl %>');">
                <label><%= __('label.otherSeasons') %></label>
                <accessories>
                  <arrow/>
                </accessories>
                <preview>
                  <crossFadePreview>
                    <image><%=: item.ParentId | imageUrl:'Primary',768 %></image>
                  </crossFadePreview>
                </preview>
              </oneLineMenuItem>
              -->
              
              <% items.forEach(function(episode, index) { %>
              <twoLineEnhancedMenuItem id="episode_<%- index %>" 
                onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, episode.Type.toLowerCase(), episode.Id] | buildUrl:{seriesId: item.SeriesId, seasonId: item.Id} %>');" 
                onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, episode.Type.toLowerCase(), episode.Id, "play"] | buildUrl:{seriesId: item.SeriesId, seasonId: item.Id} %>');">
                <label><%= episode.Name %></label>
                <rightLabel><%=: episode.PremiereDate | formatDate %></rightLabel>
                <ordinal><%- episode.IndexNumber %></ordinal>
                <maxOrdinalDigits><%- item.ChildCount.toString().length %></maxOrdinalDigits>
                <image><%=: episode.Id | imageUrl:'Primary',80 %></image>
                <defaultImage><%- 'resource://' + (episode.PrimaryImageAspectRatio >= 1.7 ? '16x9' : '4x3') + '.png' %></defaultImage>
                <accessories>
                    <% if (!episode.UserData.Played && episode.UserData.PlayCount === 0) { %><unplayedDot /><% } %>
                    <% if (!episode.UserData.Played && episode.UserData.PlayCount > 0) { %><partiallyPlayedDot /><% } %>
                </accessories>
                <preview>
                  <longDescriptionPreview>
                    <title><%= episode.Name %></title>
                    <summary><%= episode.Overview %></summary>
                    <image><%=: episode.Id | imageUrl:'Primary',480 %></image>
                    <% if (episode.SeriesStudio) { %>
                    <footnote>© <%= episode.SeriesStudio %>, All Rights Reserved.</footnote>
                    <% } %>
                    <metadata>
                      <label><%=: episode.PremiereDate | formatDate %></label>
                      <label><%=: episode.RunTimeTicks | convertTicksToMinutes | i18nN:'%s mins' %></label>
                      <mediaBadges>
                        <% if (episode.IsHD) { %><videoFormat>HD</videoFormat><% } %>
                        <% if (item.HasSubtitles) { %><closedCaption /><% } %>
                      </mediaBadges>
                      <% if (episode.CommunityRating) { %>
                      <starRating>
                        <percentage><%- episode.CommunityRating * 10 %></percentage>
                      </starRating>
                      <% } %>
                    </metadata>
                  </longDescriptionPreview>
                </preview>
              </twoLineEnhancedMenuItem>
              <% }) %>
            </items>
          </menuSection>
        </sections>
      </menu>
    </listWithPreview>
<% include ../../footer.tpl %>