// Metric based styles
export const maxeleStyle = '<?xml version="1.0" encoding="UTF-8"?> \
  <sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
    <sld:NamedLayer> \
    <sld:Name>maxele_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>maxele_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#313695" quantity="0.00" label="0.00 m"/> \
              <sld:ColorMapEntry color="#323C98" quantity="0.20" label="0.20 m"/> \
              <sld:ColorMapEntry color="#4E80B9" quantity="0.40" label="0.40 m"/> \
              <sld:ColorMapEntry color="#84BAD8" quantity="0.60" label="0.60 m"/> \
              <sld:ColorMapEntry color="#C0E3EF" quantity="0.80" label="0.80 m"/> \
              <sld:ColorMapEntry color="#EFF9DB" quantity="1.00" label="1.00 m"/> \
              <sld:ColorMapEntry color="#FEECA2" quantity="1.20" label="1.20 m"/> \
              <sld:ColorMapEntry color="#FDBD6F" quantity="1.40" label="1.40 m"/> \
              <sld:ColorMapEntry color="#F57A49" quantity="1.60" label="1.60 m"/> \
              <sld:ColorMapEntry color="#D93629" quantity="1.80" label="1.80 m"/> \
              <sld:ColorMapEntry color="#A50026" quantity="2.00" label="2.00 m"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

export const maxwvelStyle = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
  <sld:NamedLayer> \
    <sld:Name>maxwvel_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>maxwvel_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#3E26A9" quantity="0.0" label="0.0 m/s"/> \
              <sld:ColorMapEntry color="#4433CD" quantity="3.0" label="3.0 m/s"/> \
              <sld:ColorMapEntry color="#4743E8" quantity="6.0" label="6.0 m/s"/> \
              <sld:ColorMapEntry color="#4755F6" quantity="9.0" label="9.0 m/s"/> \
              <sld:ColorMapEntry color="#4367FE" quantity="12.0" label="12.0 m/s"/> \
              <sld:ColorMapEntry color="#337AFD" quantity="15.0" label="15.0 m/s"/> \
              <sld:ColorMapEntry color="#2D8CF4" quantity="18.0" label="18.0 m/s"/> \
              <sld:ColorMapEntry color="#259CE8" quantity="21.0" label="21.0 m/s"/> \
              <sld:ColorMapEntry color="#1BAADF" quantity="24.0" label="24.0 m/s"/> \
              <sld:ColorMapEntry color="#04B6CE" quantity="27.0" label="27.0 m/s"/> \
              <sld:ColorMapEntry color="#12BEB9" quantity="30.0" label="30.0 m/s"/> \
              <sld:ColorMapEntry color="#2FC5A2" quantity="33.0" label="33.0 m/s"/> \
              <sld:ColorMapEntry color="#47CB86" quantity="36.0" label="36.0 m/s"/> \
              <sld:ColorMapEntry color="#71CD64" quantity="39.0" label="39.0 m/s"/> \
              <sld:ColorMapEntry color="#9FC941" quantity="42.0" label="42.0 m/s"/> \
              <sld:ColorMapEntry color="#C9C128" quantity="45.0" label="45.0 m/s"/> \
              <sld:ColorMapEntry color="#EBBB30" quantity="48.0" label="48.0 m/s"/> \
              <sld:ColorMapEntry color="#FFC13A" quantity="51.0" label="51.0 m/s"/> \
              <sld:ColorMapEntry color="#FBD42E" quantity="54.0" label="54.0 m/s"/> \
              <sld:ColorMapEntry color="#F5E824" quantity="57.0" label="57.0 m/s"/> \
              <sld:ColorMapEntry color="#FAFB14" quantity="60.0" label="60.0 m/s"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

export const swanStyle = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
  <sld:NamedLayer> \
    <sld:Name>swan_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>swan_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#30123B" quantity="0.0" label="0.0 m"/> \
              <sld:ColorMapEntry color="#3D3790" quantity="1.0" label="1.0 m"/> \
              <sld:ColorMapEntry color="#455ACD" quantity="2.0" label="2.0 m"/> \
              <sld:ColorMapEntry color="#467BF3" quantity="3.0" label="3.0 m"/> \
              <sld:ColorMapEntry color="#3E9BFF" quantity="4.0" label="4.0 m"/> \
              <sld:ColorMapEntry color="#28BBEC" quantity="5.0" label="5.0 m"/> \
              <sld:ColorMapEntry color="#18D7CC" quantity="6.0" label="6.0 m"/> \
              <sld:ColorMapEntry color="#21EBAC" quantity="7.0" label="7.0 m"/> \
              <sld:ColorMapEntry color="#46F884" quantity="8.0" label="8.0 m"/> \
              <sld:ColorMapEntry color="#78FF5A" quantity="9.0" label="9.0 m"/> \
              <sld:ColorMapEntry color="#A3FD3C" quantity="10.0" label="10.0 m"/> \
              <sld:ColorMapEntry color="#C4F133" quantity="11.0" label="11.0 m"/> \
              <sld:ColorMapEntry color="#E2DD37" quantity="12.0" label="12.0 m"/> \
              <sld:ColorMapEntry color="#F6C33A" quantity="13.0" label="13.0 m"/> \
              <sld:ColorMapEntry color="#FEA531" quantity="14.0" label="14.0 m"/> \
              <sld:ColorMapEntry color="#FC8021" quantity="15.0" label="15.0 m"/> \
              <sld:ColorMapEntry color="#F05B11" quantity="16.0" label="16.0 m"/> \
              <sld:ColorMapEntry color="#DE3D08" quantity="17.0" label="17.0 m"/> \
              <sld:ColorMapEntry color="#C42502" quantity="18.0" label="18.0 m"/> \
              <sld:ColorMapEntry color="#A31201" quantity="19.0" label="19.0 m"/> \
              <sld:ColorMapEntry color="#7A0402" quantity="20.0" label="20.0 m"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

// Imperial based styles
export const maxeleImperialStyle = '<?xml version="1.0" encoding="UTF-8"?> \
  <sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
    <sld:NamedLayer> \
    <sld:Name>maxele_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>maxele_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#313695" quantity="0.00" label="0.00 m"/> \
              <sld:ColorMapEntry color="#323C98" quantity="0.3048" label="1.0 ft"/> \
              <sld:ColorMapEntry color="#4E80B9" quantity="0.6096" label="2.0 ft"/> \
              <sld:ColorMapEntry color="#84BAD8" quantity="0.9144000000000001" label="3.0 ft"/> \
              <sld:ColorMapEntry color="#C0E3EF" quantity="1.2192" label="4.0 ft"/> \
              <sld:ColorMapEntry color="#EFF9DB" quantity="1.524" label="5.0 ft"/> \
              <sld:ColorMapEntry color="#FEECA2" quantity="1.8288000000000002" label="6.0 ft"/> \
              <sld:ColorMapEntry color="#FDBD6F" quantity="2.1336" label="7.0 ft"/> \
              <sld:ColorMapEntry color="#F57A49" quantity="2.4384" label="8.0 ft"/> \
              <sld:ColorMapEntry color="#D93629" quantity="2.7432000000000003" label="9.0 ft"/> \
              <sld:ColorMapEntry color="#A50026" quantity="3.048" label="10.0 ft"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

export const maxwvelImperialMPHStyle = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
  <sld:NamedLayer> \
    <sld:Name>maxwvel_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>maxwvel_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#3E26A9" quantity="0.0" label="0.0 mph"/> \
              <sld:ColorMapEntry color="#4433CD" quantity="2.2352" label="5.0 mph"/> \
              <sld:ColorMapEntry color="#4743E8" quantity="4.4704" label="10.0 mph"/> \
              <sld:ColorMapEntry color="#4755F6" quantity="6.7056" label="15.0 mph"/> \
              <sld:ColorMapEntry color="#4367FE" quantity="8.9408" label="20.0 mph"/> \
              <sld:ColorMapEntry color="#337AFD" quantity="11.176" label="25.0 mph"/> \
              <sld:ColorMapEntry color="#2D8CF4" quantity="13.4112" label="30.0 mph"/> \
              <sld:ColorMapEntry color="#259CE8" quantity="15.6464" label="35.0 mph"/> \
              <sld:ColorMapEntry color="#1BAADF" quantity="17.8816" label="40.0 mph"/> \
              <sld:ColorMapEntry color="#04B6CE" quantity="20.1168" label="45.0 mph"/> \
              <sld:ColorMapEntry color="#12BEB9" quantity="22.352" label="50.0 mph"/> \
              <sld:ColorMapEntry color="#2FC5A2" quantity="24.5872" label="55.0 mph"/> \
              <sld:ColorMapEntry color="#47CB86" quantity="26.8224" label="60.0 mph"/> \
              <sld:ColorMapEntry color="#71CD64" quantity="29.0576" label="65.0 mph"/> \
              <sld:ColorMapEntry color="#9FC941" quantity="31.2928" label="70.0 mph"/> \
              <sld:ColorMapEntry color="#C9C128" quantity="33.528" label="75.0 mph"/> \
              <sld:ColorMapEntry color="#EBBB30" quantity="35.7632" label="80.0 mph"/> \
              <sld:ColorMapEntry color="#FFC13A" quantity="37.9984" label="85.0 mph"/> \
              <sld:ColorMapEntry color="#FBD42E" quantity="40.2336" label="90.0 mph"/> \
              <sld:ColorMapEntry color="#F5E824" quantity="42.4688" label="95.0 mph"/> \
              <sld:ColorMapEntry color="#FAFB14" quantity="44.704" label="100.0 mph"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

export const maxwvelImperialKnotsStyle = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
  <sld:NamedLayer> \
    <sld:Name>maxwvel_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>maxwvel_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#3E26A9" quantity="0.0" label="0.0 kn"/> \
              <sld:ColorMapEntry color="#4433CD" quantity="2.57222" label="5.0 kn"/> \
              <sld:ColorMapEntry color="#4743E8" quantity="5.14444" label="10.0 kn"/> \
              <sld:ColorMapEntry color="#4755F6" quantity="7.71666" label="15 kn"/> \
              <sld:ColorMapEntry color="#4367FE" quantity="10.28888" label="20.0 kn"/> \
              <sld:ColorMapEntry color="#337AFD" quantity="12.8611" label="25.0 kn"/> \
              <sld:ColorMapEntry color="#2D8CF4" quantity="15.43332" label="30.0 kn"/> \
              <sld:ColorMapEntry color="#259CE8" quantity="18.00554" label="35.0 kn"/> \
              <sld:ColorMapEntry color="#1BAADF" quantity="20.57776" label="40.0 kn"/> \
              <sld:ColorMapEntry color="#04B6CE" quantity="23.14998" label="45.0 kn"/> \
              <sld:ColorMapEntry color="#12BEB9" quantity="25.7222" label="50.0 kn"/> \
              <sld:ColorMapEntry color="#2FC5A2" quantity="28.294420000000002" label="55.0 kn"/> \
              <sld:ColorMapEntry color="#47CB86" quantity="30.86664" label="60.0 kn"/> \
              <sld:ColorMapEntry color="#71CD64" quantity="33.43886" label="65.0 kn"/> \
              <sld:ColorMapEntry color="#9FC941" quantity="36.01108" label="70.0 kn"/> \
              <sld:ColorMapEntry color="#C9C128" quantity="38.5833" label="75.0 kn"/> \
              <sld:ColorMapEntry color="#EBBB30" quantity="41.15552" label="80.0 kn"/> \
              <sld:ColorMapEntry color="#FFC13A" quantity="43.727740000000004" label="85.0 kn"/> \
              <sld:ColorMapEntry color="#FBD42E" quantity="46.29996" label="90.0 kn"/> \
              <sld:ColorMapEntry color="#F5E824" quantity="48.87218" label="95.0 kn"/> \
              <sld:ColorMapEntry color="#FAFB14" quantity="51.4444" label="100.0 kn"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';

export const swanImperialStyle = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"> \
  <sld:NamedLayer> \
    <sld:Name>swan_client_style</sld:Name> \
    <sld:UserStyle> \
      <sld:Name>swan_client_style</sld:Name> \
      <sld:FeatureTypeStyle> \
        <sld:Name>name</sld:Name> \
        <sld:Rule> \
          <sld:RasterSymbolizer> \
            <sld:ChannelSelection> \
              <sld:GrayChannel> \
                <sld:SourceChannelName>1</sld:SourceChannelName> \
                <sld:ContrastEnhancement> \
                  <sld:GammaValue>1.0</sld:GammaValue> \
                </sld:ContrastEnhancement> \
              </sld:GrayChannel> \
            </sld:ChannelSelection> \
            <sld:ColorMap> \
              <sld:ColorMapEntry color="#30123B" quantity="0.0" label="0.0 ft"/> \
              <sld:ColorMapEntry color="#3D3790" quantity="0.9144000000000001" label="3.0 ft"/> \
              <sld:ColorMapEntry color="#455ACD" quantity="1.8288000000000002" label="6.0 ft"/> \
              <sld:ColorMapEntry color="#467BF3" quantity="2.7432000000000003" label="9.0 ft"/> \
              <sld:ColorMapEntry color="#3E9BFF" quantity="3.6576000000000004" label="12.0 ft"/> \
              <sld:ColorMapEntry color="#28BBEC" quantity="4.572" label="15.0 ft"/> \
              <sld:ColorMapEntry color="#18D7CC" quantity="5.486400000000001" label="18.0 ft"/> \
              <sld:ColorMapEntry color="#21EBAC" quantity="6.4008" label="21.0 ft"/> \
              <sld:ColorMapEntry color="#46F884" quantity="7.315200000000001" label="24.0 ft"/> \
              <sld:ColorMapEntry color="#78FF5A" quantity="8.2296" label="27.0 ft"/> \
              <sld:ColorMapEntry color="#A3FD3C" quantity="9.144" label="30.0 ft"/> \
              <sld:ColorMapEntry color="#C4F133" quantity="10.0584" label="33.0 ft"/> \
              <sld:ColorMapEntry color="#E2DD37" quantity="10.972800000000001" label="36.0 ft"/> \
              <sld:ColorMapEntry color="#F6C33A" quantity="11.8872" label="39.0 ft"/> \
              <sld:ColorMapEntry color="#FEA531" quantity="12.8016" label="42.0 ft"/> \
              <sld:ColorMapEntry color="#FC8021" quantity="13.716000000000001" label="45.0 ft"/> \
              <sld:ColorMapEntry color="#F05B11" quantity="14.630400000000002" label="48.0 ft"/> \
              <sld:ColorMapEntry color="#DE3D08" quantity="15.5448" label="51.0 ft"/> \
              <sld:ColorMapEntry color="#C42502" quantity="16.4592" label="54.0 ft"/> \
              <sld:ColorMapEntry color="#A31201" quantity="17.3736" label="57.0 ft"/> \
              <sld:ColorMapEntry color="#7A0402" quantity="18.288" label="60.0 ft"/> \
            </sld:ColorMap> \
            <sld:ContrastEnhancement/> \
          </sld:RasterSymbolizer> \
        </sld:Rule> \
      </sld:FeatureTypeStyle> \
    </sld:UserStyle> \
  </sld:NamedLayer> \
</sld:StyledLayerDescriptor>';