import { ArrowLeftIcon, BookBookmarkIcon, DotsThreeIcon, MapPinIcon } from "phosphor-react-native";
import {StyleSheet, Text, View, Image, ScrollView, TouchableOpacity} from "react-native";

export default function Details() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.headerImage} source={require("../assets/Room.jpg")} />

                <View style={styles.headerInfoButtons}>
                    <ArrowLeftIcon size={32} color= "#f4f4f4" />

                    <View style={styles.headerInfoButtonsRight}>
                        <BookBookmarkIcon size={32} color= "#f4f4f4" />
                        <DotsThreeIcon size={32} color= "#f4f4f4" />
                    </View>
                </View>
            </View>
            
            <Text style={styles.infoNameText}> Hotel Nova Vista</Text>

            <View style={styles.contentAddress}>
                <MapPinIcon size={32} color="#1ab65c" />
                <Text style={styles.contentAddressText}>Avenida Andrade Neves 450, Santo André - SP</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.containerGalleryPhotos}>
                <Text style={styles.containerGalleryPhotosTextGallery}>Galeria de Fotos</Text>
                <Text style={styles.containerGalleryPhotosTextSeeAll}>Ver Todas</Text>
            </View>

            <ScrollView horizontal style={styles.contentPhotoContainer}>
                <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
                <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
                <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerContainerText}>
                    <Text style={styles.footerContainerTextMoney}>R$ 450</Text>
                    <Text style={styles.footerContainerTextMonth}>/ mês</Text>
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20", 
  },

  header: {
    width: "100%",
    height: "40%",
  },

  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  headerInfoButtons: {
    marginTop: 30,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerInfoButtonsRight: {
    flexDirection: "row",
    gap: 10,
  },

  infoNameText:{
    color: "#f4f4f4",
    fontSize: 36,
    fontWeight:"bold",
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  contentAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingTop: 15,
  },

  contentAddressText: {
    color: "#f4f4f4",
    fontSize: 12,
  },

  separator:{
    height: 1,
    backgroundColor: "#757575",
    marginHorizontal: 30,
    marginTop: 20,
  },

  containerGalleryPhotos: {
    flexDirection: "row",
    paddingHorizontal: 30,
    marginTop: 20,
    justifyContent: "space-between",
  },

  containerGalleryPhotosTextGallery: {
    fontSize: 18,
    color: "#f4f4f4",
    fontWeight: "bold",
  },

  containerGalleryPhotosTextSeeAll: {
    fontSize: 16,
    color: "#1ab65c",
    fontWeight: "400",
  },

  contentPhotoContainer: {
    paddingHorizontal: 30,
    paddingTop: 15,
  },

  contentPhotoImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },

  footer: {
    width: "100%",
    borderWidth: 1,
    height: 80,
    borderRightColor: "#757575",
    borderLeftColor: "#757575",
    borderTopColor: "#757575",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  footerContainerText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,

  },

  footerContainerTextMoney: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1ab65c",
  },

  footerContainerTextMonth: {
    fontSize: 12,
    fontWeight: "400",
    color: "#f4f4f4",
  },

  button: {
    backgroundColor: "#1ab55c",
    flex: 1,
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "800",
  },
})