function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Brick Neon Settings</Text>}>
      
        <Select
          label={`Weekday Name`}
          settingsKey="dowformat"
          options={[
            {name:"Short", value:"0"},
            {name:"Long", value:"1"}
          ]}
        />
        
        
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);