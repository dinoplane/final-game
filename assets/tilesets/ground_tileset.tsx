<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.8" tiledversion="1.8.4" name="ground_tileset" tilewidth="64" tileheight="64" tilecount="50" columns="10">
 <image source="ground_tileset.png" width="640" height="320"/>
 <tile id="1" type="food"/>
 <tile id="3" type="player"/>
 <tile id="5" type="RangeElement">
  <properties>
   <property name="elements" value="'Use ', keyboard"/>
   <property name="oneUse" type="int" value="-1"/>
   <property name="rangeHeight" type="int" value="150"/>
   <property name="rangeOffsetX" type="int" value="0"/>
   <property name="rangeOffsetY" type="int" value="0"/>
   <property name="rangeWidth" type="int" value="150"/>
  </properties>
 </tile>
 <tile id="10" probability="0.1"/>
 <tile id="14" probability="0.1"/>
</tileset>
