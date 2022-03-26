#include "mbed.h"
#include "platform/mbed_thread.h"
#include "TextLCD.h"
#define BUFFER_SIZE 3
#define SLAVE_ADDR 0xA0
#define BLINKING_RATE_MS 1000

RawSerial pc(USBTX, USBRX);

I2CSlave slave(D14, D15);
DigitalOut led(LED1);
AnalogIn sensor(A5);
BusOut motorDC(D8, D9);
//////////
DigitalIn fan(A1);
DigitalIn danger(A2);
DigitalIn stop(BUTTON1);
/////////////
TextLCD lcd(D7, D6, D5, D4, D3, D2, TextLCD::LCD16x2); // rs,e,d4-d7

bool f = 0;
int ADCdata, datoSensor, ADCdataU, ADCdataD;
char buf[BUFFER_SIZE] = "AB";
char motor[2] = {0x0, 0x1};
float valor1;
int a = 0, b = 0;

int temFun = 20, temDanger = 30;

PwmOut myServo(A3);

void leer_sensor();
void ISR_fan();
void ISR_danger();
void ISR_stop();

int main()
{

    pc.baud(9600);
    slave.address(SLAVE_ADDR);
    ////////////////////
    lcd.cls();
    lcd.locate(0, 1);
    lcd.printf("=>");
    lcd.locate(0, 0);
    lcd.printf("Temperatura:");

    //////////////////

    while (1)
    {
        int i = slave.receive();
        switch (i)
        {
        case I2CSlave::ReadAddressed:
            slave.write(buf, BUFFER_SIZE);
            pc.printf("Enviando al maestro: %s", buf);
            f = 1;
            break;
        case I2CSlave::WriteGeneral:
            break;
        case I2CSlave::WriteAddressed:
            slave.read(buf, BUFFER_SIZE);
            if (buf[0] == 49)
            {
                motorDC = motor[1];
            }
            if (buf[0] == 50)
            {
                motorDC = motor[1];
                myServo.write((0.05 + ((0.05 * 180) / 45)) / 2.5);
            }
            if (buf[0] == 51)
            {
                motorDC = motor[0];
                myServo.write((0.05 + ((0.05 * 0) / 45)) / 2.5);
            }
            break;
        }

        if (f == 1)
        {
            leer_sensor();
            f = 0;
        }
        lcd.locate(12, 0);
        valor1 = ADCdata;
        valor1 = valor1 * 220 / 65535;
        lcd.printf("%2.1f", valor1);

        //////////////
        if (valor1 >= temFun && valor1 < temDanger)
        {
            lcd.locate(2, 1);
            lcd.printf(" VENTILADOR!!!");
        }
        else if (valor1 >= temDanger)
        {
            lcd.locate(2, 1);
            lcd.printf(" ESCLUSAS!!   ");
        }
        else
        {
            lcd.locate(2, 1);
            lcd.printf(" CORRECTO!!!");
        }

        if (fan == 0 && a == 0)
        {
            ISR_fan();
            a++;
            // wait(0.5);
        }
        else if (danger == 0 && b == 0)
        {
            ISR_danger();
            b++;
        }
        else if (a == 1 && fan == 0)
        {
            a = 0;
            ISR_stop();
            // wait(0.5);
        }
        else if (b == 1 && danger == 0)
        {
            b = 0;
            ISR_stop();
        }
    }

    void leer_sensor()
    {

        int valor = 0;
        int vector[2];
        for (int i = 0; i < 2; i++)
        {
            vector[i] = sensor.read_u16();
            valor = valor + vector[i]; // Toma de datos
        }
        ADCdata = valor / 2;
        ADCdataU = ADCdata >> 8;
        ADCdataD = ADCdata - (ADCdataU << 8);
        pc.printf("dato pot %d\n", ADCdata);
        pc.printf("dato pot %d\n", ADCdataU);
        pc.printf("dato pot %d\n", ADCdataD);
        buf[0] = ADCdataU;
        buf[1] = ADCdataD;

        // return ADCdata;
    }
    /////////////////////////////
    void ISR_fan()
    {
        motorDC = motor[1];
    }

    void ISR_danger()
    {
        motorDC = motor[1];
        myServo.write((0.05 + ((0.05 * 180) / 45)) / 2.5);
    }
    void ISR_stop()
    {
        motorDC = motor[0];
        myServo.write((0.05 + ((0.05 * 0) / 45)) / 2.5);
    }