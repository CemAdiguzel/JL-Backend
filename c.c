#include <stdio.h>
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>

void *thread1()
{

    char str_message[10] = {"CXGPIGTU"};
    char ch;
    // ch = (char)a;

    int j, key;
    key = 2;

    for (j = 0; str_message[j] != '\0'; ++j)
    {
        ch = str_message[j];
        if (ch >= 'a' && ch <= 'z')
        {
            ch = ch - key;
            if (ch < 'a')
            {
                ch = ch + 'z' - 'a' + 1;
            }
            str_message[j] = ch;
        }

        else if (ch >= 'A' && ch <= 'Z')
        {
            ch = ch - key;
            if (ch < 'A')
            {
                ch = ch + 'Z' - 'A' + 1;
            }
            str_message[j] = ch;
        }
    }
    char *usr = malloc(25);
    strcpy(usr, str_message);

    // printf("Decrypted message: %s \n", str_message);
    pthread_exit((void *)usr); // kendi thread'ini bitirmek için
}

void *thread2()
{

    char str_message[10] = {"CUUGODNG"};
    char ch;
    // ch = (char)b;

    int j, key = 2;

    for (j = 0; str_message[j] != '\0'; ++j)
    {
        ch = str_message[j];
        if (ch >= 'a' && ch <= 'z')
        {
            ch = ch - key;
            if (ch < 'a')
            {
                ch = ch + 'z' - 'a' + 1;
            }
            str_message[j] = ch;
        }

        else if (ch >= 'A' && ch <= 'Z')
        {
            ch = ch - key;
            if (ch < 'A')
            {
                ch = ch + 'Z' - 'A' + 1;
            }
            str_message[j] = ch;
        }
    }
    // sleep(0.1);
    char *usr = malloc(25);
    strcpy(usr, str_message);
    // printf("Decrypted message: %s \n", str_message);
    pthread_exit((void *)usr); // kendi thread'ini bitirmek için
}

int main(int argc, char const *argv[])
{
    pthread_t th1, th2;
    char *usr1, *usr2;

    pthread_create(&th1, NULL, thread1, NULL);
    pthread_create(&th2, NULL, thread2, NULL);
    pthread_join(th1, &usr1);
    printf("%s ", usr1);
    pthread_join(th2, &usr2);
    printf("%s \n", usr2);

    return 0;
}