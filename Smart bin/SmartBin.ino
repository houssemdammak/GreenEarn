#include "HX711.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SPI.h>
#include "qrcode.h"  // Ajoutez une librairie pour générer le QR code (si ce n'est pas déjà le cas)
#include <math.h> // N'oubliez pas d'inclure cette bibliothèque pour utiliser round()

// Définition des pins
#define DOUT  4
#define CLK  5
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_MOSI   11
#define OLED_CLK    13
#define OLED_DC     9
#define OLED_CS     10
#define OLED_RESET  8

HX711 scale;
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &SPI, OLED_DC, OLED_RESET, OLED_CS);

float weight = 0.000; 
float calibration_factor = 419640; // Facteur de calibration
float binCapacity = 0.10; // Capacité maximale du bin

void setup() {
  Serial.begin(9600);
  scale.begin(DOUT, CLK);
  scale.set_scale(calibration_factor);
  scale.tare(); // Reset de la balance à 0
  
  if (!display.begin(SSD1306_SWITCHCAPVCC)) {
    Serial.println(F("Échec de l'initialisation de l'écran OLED"));
    while (true);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.display();
}

void loop() {
  weight = scale.get_units(10); 
  if (weight < 0) weight = 0.0000;

  // Si aucun poids détecté, attendre
 
  while (weight == 0.00) {
    afficherMessage("Welcome !",1000);
    //afficherPoids(0.00);
    delay(100);
    return;
  }

  // Si le poids est inférieur à la capacité
  if (weight <= binCapacity && weight != 0 && weight> 0.01 ) {
      afficherMessage("Welcome !",1000);


    // Le QR code reste affiché jusqu'à ce que le poids change
    while (abs(weight -scale.get_units(10))<0.01) {

      afficherPoids(weight);
    delay(3000);
    // Afficher "Scanner le QR code" pendant 3 secondes
    afficherMessage("Scan the   QR code", 3000);
    
    // Générer le QR code avec les données de l'objet pesé
    genererQRCode(weight);
    delay(10000);
    afficherMessage("Thank you!",1000);
   

    }
  } 
  if(weight > binCapacity ) {
        afficherMessage("Depassed", 3000);

    }
  // Si le poids dépasse la capacité
  else {
    afficherPoids(weight);
  }
}

// Fonction pour afficher le poids
// Fonction pour afficher le poids
void afficherPoids(float poids) {
    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.print("Weight :");
  
    // Buffer pour la chaîne de poids formatée
    char poidsStr[10]; // Assurez-vous que la taille est suffisante pour contenir le float formaté
    dtostrf(poids, 6, 3, poidsStr); // Convertit le float en chaîne avec 3 décimales

    display.setCursor(0, 35);
    display.print(poidsStr); // Affiche le poids formaté
    display.setCursor(75, 35);
    display.print("Kg");
    display.display();
}


// Fonction pour afficher un message pendant un temps donné
void afficherMessage(const char* message, int duree) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 20);
  display.print(message);
  display.display();
  delay(duree);
}

// Fonction pour générer et afficher le QR code
void genererQRCode(float quantite) {
  const char* qrTemplate = "{\"binId\":\"670ce6a1e80343a3b0fd9a11\",\"quantity\":\"%d\"}";
  char qrData[100];
  snprintf(qrData, sizeof(qrData), qrTemplate, (int)round(quantite * 1000));  // Convertir en grammes

  QRCode qrcode;
  uint8_t qrcodeData[qrcode_getBufferSize(3)];
  qrcode_initText(&qrcode, qrcodeData, 3, 0, qrData);
  // Ajuster le contraste avant d'afficher le QR code
  display.ssd1306_command(SSD1306_SETCONTRAST);
  display.ssd1306_command(80); // Ajustez cette valeur selon vos besoins
  // Dessiner le QR code sur l'écran OLED
  float scale = 2;  // Échelle du QR code
  int offsetX = (SCREEN_WIDTH - qrcode.size * scale) / 2;
  int offsetY = (SCREEN_HEIGHT - qrcode.size * scale) / 2;

  display.clearDisplay();
  for (uint8_t y = 0; y < qrcode.size; y++) {
    for (uint8_t x = 0; x < qrcode.size; x++) {
      if (qrcode_getModule(&qrcode, x, y)) {
        display.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale, SSD1306_WHITE);
      }
    }
  }
  display.display();
  //display.setContrast(255); // Ajustez cette valeur selon vos besoins (0 à 255)

}
