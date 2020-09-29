import React, { useEffect, useState, useRef } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Platform,
} from 'react-native';
import MapView, { UrlTile, PROVIDER_GOOGLE, Marker, Callout, } from 'react-native-maps';

import { useHttp } from '../hooks/http.hook'

export const Home = ({ navigation }) => {
    const [markerCoords, setMarkerCoords] = useState({ "latitude": 360, "longitude": 360 })
    const [unitsSystem, setUnitsSystem] = useState('metric')
    const [showTip, setShowTip] = useState(true)
    const [currentCity, setCurrentCity] = useState(null)
    const [currentTemp, setCurrentTemp] = useState(null)
    const [showCallout, setShowCallout] = useState(false)
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    const markerRef = useRef(null);

    const IS_IOS = Platform.OS === 'ios'

    const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
    const WEATHER_API_KEY = '95e01fabdd174fc4972bcd4fb76fe05e'

    const { error, request } = useHttp()

    const { latitude, longitude } = markerCoords
    const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.hideCallout();
        }
    }, [])

    useEffect(() => {
        getWeather()
    }, [markerCoords])

    // const onRegionChange = (region) => {
    //     // this.setState({ region });
    //     setRegion(region)
    // }

    const getWeather = async () => {
        try {
            const req = await request(weatherUrl)
            setCurrentCity(req.name)
            setCurrentTemp(req.main.temp)
            console.log(req.name)
            console.log(req.main.temp)
        } catch (e) {
            console.log(e)
        }
    }

    const onMapLongPress = (e) => {
        setShowTip(false)
        setMarkerCoords(null)
        setMarkerCoords(e.nativeEvent.coordinate)
        console.log('Coords changed', e.nativeEvent.coordinate)
        setShowCallout(false)
    }

    return (
        <View>
            <MapView
                // onRegionChange={onRegionChange}
                style={styles.mapStyle}
                showsUserLocation={false}
                showsMyLocationButton={false}
                zoomEnabled={true}
                followUserLocation={false}
                provider={PROVIDER_GOOGLE}
                zoomControlEnabled={true}

                onPress={() => { setShowTip(true) }}
                onLongPress={(e) => { onMapLongPress(e) }}

                // initialRegion={region}

                onRegionChange={region => {
                    setRegion(region)
                }}
            >
                {markerCoords ?
                    <Marker
                        ref={markerRef}
                        // draggable 
                        coordinate={
                            markerCoords
                        }
                        image={IS_IOS ? require('../assets/pin2.png') : require('../assets/pin128.png')}
                        // onDragEnd={(e) => {
                        //     console.log(e.nativeEvent)
                        //     onMapLongPress(e)
                        //     getWeather()
                        //     // setMarkerCoords(markerCoords)
                        // }}
                        onPress={() => {
                            setMarkerCoords(markerCoords)
                            setShowCallout(true)
                        }}

                    >
                        {/* {showCallout ? */}
                        <Callout
                            tooltip={true}
                            onPress={() => {
                                navigation.navigate('Search', {
                                    data: {
                                        city: currentCity,
                                        lat: markerCoords.latitude,
                                        lon: markerCoords.longitude,
                                    }
                                })
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingHorizontal: 20,
                                    paddingVertical: 20,
                                    borderRadius: 5,
                                    borderColor: 'violet',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                }}
                            >
                                <Text>{currentCity}</Text>
                                <Text>{currentTemp}°C</Text>
                            </View>
                        </Callout>
                        {/* : null } */}

                    </Marker> : null}
            </MapView>
            {showTip ?
                <View style={styles.toolTip} onPress={() => setShowTip(false)}>
                    <Text style={styles.toolTipText}>Press to a place for a few seconds where you want to know the weather. Then press on marker.</Text>
                </View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginBottom: 40,
        zIndex: 999,
    },
    toolTip: {
        position: 'absolute',
        bottom: 135,
        backgroundColor: 'purple',
        marginHorizontal: 30,
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 15,
        left: 0, right: 0,
        justifyContent: 'center',
    },
    toolTipText: {
        color: '#fff',
        textAlign: 'center'
    },
})