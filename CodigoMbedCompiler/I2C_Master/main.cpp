#include "mbed.h"
#include "platform/mbed_thread.h"

#define BUFFER_SIZE 3
#define SLAVE_ADDR 0xA0

RawSerial pc(USBTX, USBRX);

I2C master(D14, D15); // SDA, SCL

DigitalIn btn(BUTTON1);
DigitalOut led(LED1);

int caracter, caracter1;
int comand;
float ADCdata;

char bufSend[BUFFER_SIZE]; // Configuracion esclavo mbed
char bufReceive[BUFFER_SIZE];
int send_index = 0;
float temp;
bool flag = false;
void ISR_serial();

int main()
{
    pc.baud(9600);
    pc.attach(&ISR_serial);
    bufSend[1] = 32;
    bufSend[2] = 32;

    while (true)
    {
        master.read(SLAVE_ADDR, bufReceive, BUFFER_SIZE);
        ADCdata = (bufReceive[0] << 8) + bufReceive[1];
        temp = (ADCdata)*220 / 65535;
        pc.printf("%.2f \n", temp);

        if (flag == true)
        {
            master.write(SLAVE_ADDR, bufSend, BUFFER_SIZE);
            flag = false;
        }
        wait(1);
    }
}

void ISR_serial()
{
    if (pc.readable())
    {
        caracter = pc.getc();
        bufSend[0] = caracter;
        flag = true;
        pc.printf("%d", caracter);
    }
}