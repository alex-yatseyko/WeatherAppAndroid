import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useHttp } from '../hooks/http.hook'

const WEATHER_API_KEY = '95e01fabdd174fc4972bcd4fb76fe05e'
const GEOCODING_KEY = 'AIzaSyBCyOEh2WrOPQOTrUtFZdknEInK6TthZxI'
const IS_IOS = Platform.OS === 'ios'

export const Search = ({ route, navigation }) => {
    const { error, request } = useHttp()
    const { data } = route.params ? route.params : {};
    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState([])
    const [search, setSearch] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [errorSearch, setSearchError] = useState('')

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getCityCoords = async () => {
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${GEOCODING_KEY}`
        try {
            const req = await request(geocodingUrl)
            // console.log(geocodingUrl)
            if(req.status == 'OK') {
                setCity({
                    city: req.results[0].address_components.long_name,
                    lat: req.results[0].geometry.location.lat,
                    lon: req.results[0].geometry.location.lng,
                })
                // setSearch(req.results[0].address_components.long_name)
                setShowResults(false)
            } else {
                setSearchError(req.status)
                setShowResults(true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getWeatherFull = async () => {
        // const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${WEATHER_API_KEY}`
        // const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city.city}&cnt=7&appid=${WEATHER_API_KEY}`
        
        const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&units=metric&exclude=hourly,minutely,current,alerts&appid=${WEATHER_API_KEY}`
        // const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=london&units=metric&APPID=value&cnt=7&appid=${WEATHER_API_KEY}`
        
        // const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7&appid=${WEATHER_API_KEY}`
        // const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&exclude=hourly,minutely,current,alerts&cnt=42&appid=${WEATHER_API_KEY}`
        
        console.log(weatherUrl)
        try {
            const req = await request(weatherUrl)
            setWeatherData(req.daily)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        data ? setCity(data) : null
        data ? setSearch(data.city) : null
        data ? setShowResults(false) : null
    }, [data])

    useEffect(() => {
        getWeatherFull()
    }, [city])

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        setSearch('')
                    }}
                >
                    <Icon name="chevron-left" size={25} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.title}>City Search</Text>
                <Icon name="chevron-left" size={25} color={'purple'} />
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    onChange={(e) => {
                        setShowResults(false)
                        setSearch(e.nativeEvent.text)
                    }}
                    value={search}
                />
                <TouchableOpacity
                    onPress={() => {
                        getCityCoords()
                    }}
                    style={styles.searchBtn}
                >
                    <Icon name="search" size={25} color={'white'} />
                </TouchableOpacity>
                {showResults ?
                <ScrollView style={styles.results}>
                    <Text>{errorSearch ? errorSearch : null}</Text>
                </ScrollView>
                : null }
            </View>
            <ScrollView style={[styles.dataWrapper, showResults ? {marginTop: 100} : null, {marginBottom: IS_IOS ? 0 : 130}]}>
                {weatherData ? weatherData.map(e => {
                    const numberOfTheDay = (new Date(e.dt * 1000).getDay())

                    return (
                        <>
                        <View style={styles.oneDayBlock} key={e.dt}>
                            <Text style={styles.oneDayBlockText}>{
                                days[numberOfTheDay]}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="thermometer-half" size={25} color={'white'} />
                                <Text style={styles.oneDayBlockText}>{e.temp.day}</Text>
                            </View>
                        </View>
                        </>)
                })
                    : null}
            </ScrollView> 
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    header: {
        width: Dimensions.get('window').width,
        backgroundColor: 'purple',
        height: 60,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontSize: 25,
        color: 'white'
    },
    input: {
        borderWidth: 1,
        width: Dimensions.get('window').width - Dimensions.get('window').width / 3,
        marginRight: 10,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    searchBtn: {
        backgroundColor: 'purple',
        borderRadius: 55,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    form: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    dataWrapper: {
        paddingHorizontal: 20,
        zIndex: 100,
        position: 'relative',
        paddingBottom: 100,
    },
    oneDayBlock: {
        backgroundColor: 'purple',
        flexDirection: 'row',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    oneDayBlockText: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 5,
    },
    results: {
        position: 'absolute',
        top: 65,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginHorizontal: 20,
        width: '100%',
        height: 100,
        zIndex: 999,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 10,
    }
})
