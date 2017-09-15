<?xml version="1.0" encoding="UTF-8"?>
<atv>
  <head>
    <script src="<%=: ['js/logger.js'] | buildUrl %>" />
    <script src="<%=: ['js/utils.js'] | buildUrl %>" />
    <script src="<%=: ['js/settings.js'] | buildUrl %>" />
  </head>
  <body>
    <listWithPreview id="SettingsPage">
        <header>
            <simpleHeader>
                <title><%= __('settings.title') %></title>
            </simpleHeader>
        </header>
        <preview>
            <keyedPreview>
                <title>&#x00AD;</title>
                <summary/>
                <metadataKeys>
                    <label><%= __('settings.version') %></label>
                    <label><%= __('settings.author') %></label>
                    <label><%= __('settings.homepage') %></label>
                </metadataKeys>
                <metadataValues>
                    <label><%= app.getVersion() %></label>
                    <label>René "Eagle" Adler</label>
                    <label>https://github.com/adlerre/EmbyConnect</label>
                </metadataValues>
                <image><%=: ['images/emby-logo.png'] | buildUrl %></image>
            </keyedPreview>
        </preview>
        
        <menu>
            <sections>  
                <menuSection>
                    <header>
                        <horizontalDivider alignment="left">
                            <title>Emby Media Server</title>
                        </horizontalDivider>
                    </header>
                    <items>
                        <oneLineMenuItem id="selectServer" onSelect="settings.selectServer()">
                            <label><%= __('settings.server') %></label>
                            <rightLabel></rightLabel>
                            <accessories>
                                <arrow/>
                            </accessories>
                        </oneLineMenuItem>
                        <oneLineMenuItem id="user" dimmed="false" onSelect="settings.selectUser()">
                            <label><%= __('settings.user') %></label>
                            <rightLabel></rightLabel>
                            <accessories>
                                <arrow/>
                            </accessories>
                        </oneLineMenuItem>
                    </items>
                </menuSection>
            </sections>
        </menu>
    </listWithPreview>
<% include ../shared/footer.tpl %>