<p align="center">
  <img src="https://i.postimg.cc/nhMxnSXj/banner-github.png" width="500"> 
</p>

# <p align="center">Modereta Vaporwave</p>

<p align="center">
  <strong>Modereta Vaporwave</strong> es el bot <strong>privado</strong> de la comunidad de Discord <strong>Astro Vaporwave.</strong>
</p>
<p align="center">
  <strong>A continuación podrás encontrár una guía de las funcionalidades que tiene el bot y como se usan así como información importante relacionada con este.</strong>
</p>

<br>

## <p align="center">GUÍA</p>

## <p align="center">https://xurxomf.gitbook.io/docs-modereta/</p>

### Niveles 🆙

Una de las funcionalidades más importantes del bot es el sistema de niveles. Gracias a este podréis ganar experiencia jugando con bots, hablando, y realizando varias actividades en el servidor, para de esta forma, subir de nivel y ganar recompensas.

<details open>
<summary>Comandos</summary>
  
-   #### `/nivel`

    Muestra el nivel, xp y roles obtenidos tuyos o del usuario que menciones.

    | Parámetro  | Tipo    | Obligatorio? | Descripción                                |
    | ---------- | ------- | :----------: | ------------------------------------------ |
    | `usuario`  | Mención | No           | Usuario del que quieres ver la información |

</details>

---

### Lista de series de Sofi 📋

La segunda funcionalidad más importante del bot es la de las series coleccionadas por cada usuario en Sofi bot. Con esta podrás añadir las series que coleccionas a una lista para que cuando alguna carta de esas series sea dropeada en Sofi, Modereta te mencionará para que puedas reclamarla. Si no te da tiempo no te preocupes, Modereta mostrará cual es la serie que coleccionas para que otra persona pueda reclamarla por ti. Si no te interesa ninguna carta de tu drop y otra persona colecciona algo, se amable y reclámala para dársela. Si das cartas, la gente te dará cartas!

Para que Modereta te notifique tienen que haber hecho drop al menos **1** vez en las últimas **24 horas** y tener los ping activos, puedes activarlos y desactivarlos con `/sofi series ping`.

<details open>
<summary>Comandos</summary>
  
-   #### `/sofi series añadir`

    Añade una serie a tu lista de series coleccionadas.

    | Parámetro | Tipo  | Obligatorio? | Descripción                         |
    | --------- | ----- | :----------: | ----------------------------------- |
    | `serie`   | Texto | Si           | Serie que quieres añadir a tu lista |

    > El nombre de la serie tienes que escribirlo exactamente igual al que aparece en `scl <serie>`, si no no funcionará.
    > Podrás añadir un máximo de 150 series!
    >
    > <img src="https://i.postimg.cc/X79CdyCx/ejemplo-nombre-serie.png" width="400">

<br>

-   #### `/sofi series eliminar`

    Elimina una serie de tu lista de series coleccionadas.

    | Parámetro | Tipo  | Obligatorio? | Descripción                            |
    | --------- | ----- | :----------: | -------------------------------------- |
    | `serie`   | Texto |      Si      | Serie que quieres eliminar de tu lista |

    > El nombre de la serie tienes que escribirlo exactamente igual al que aparce en tu lista de series si no no funcionará. Puedes usar el comando `/sofi series lista` para ver como la tienes agregada.

<br>
  
-   #### `/sofi series lista`

    Muestra tu listra de series coleccionadas o la de otro usuario.

    | Parámetro | Tipo  | Obligatorio? | Descripción                                                  |
    | --------- | ----- | :----------: | ------------------------------------------------------------ |
    | `usuario` | Texto | No           | Usuario del que quieres ver la lista de series coleccionadas |

<br>
  
-   #### `/sofi series ping`

    Activa o desactiva los pings cuando se dropee una serie que coleccionas.

    | Parámetro | Tipo  | Obligatorio? | Descripción                                            |
    | --------- | ----- | :----------: | ------------------------------------------------------ |
    | `activo`  | V o F | Si           | True si quieres que te haga ping o False si no quieres |

    > Los usuarios podrán seguir viendo las series que coleccionas con el comando `/sofi series lista` pero Modereta no te notificará cuando se dropeen cartas de tus series coleccionadas.

</details>

---

### Ping de drops por actividad de Sofi 🔔

Cuando Sofi haga un drop por actividad, como son el Drop de Series, Captcha Drop y Minigame, Modereta hará ping al rol `@📌 Sofi Pings` que puedes asignarte en `Canales y roles` en la parte superior de la lista de canales del servidor.

---

### Acciones 🫂

Envía un GIF anime realizando ciertas acciones al usuario que menciones.

<details open>
<summary>Comandos</summary>
  
-   #### `/acciones abrazo`

    Le das un abrazo a la persona que menciones.

    | Parámetro  | Tipo    | Obligatorio? | Descripción                       |
    | ---------- | ------- | :----------: | --------------------------------- |
    | `usuario`  | Mención | Si           | Usuario al que realizar la acción |

<br>

-   #### `/acciones asesinar`

    Asesinas a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones besito`

    Le das un besito en la frente o la mejilla a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones beso`

    Le das un beso a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones chocarcinco`

    Le chocas los cinco a la persona que mencionas.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones cosquillas`

    Le haces cosquillas la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones lamer`

    Le pegas un lametón a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones morder`

    Le pegas un mordisco a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones observar`

    Miras fijamente a la persona que mencionas.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones omedetou`

    Omedetou Shinji 👏👏

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones pat`

    Le haces pat pat a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones poke`

    Pinchas con el dedo a la persona que mencionas.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

<br>

-   #### `/acciones puñetazo`

    Le pegas un puñetazo a la persona que menciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción                       |
    | --------- | ------- | :----------: | --------------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que realizar la acción |

</details>

---

### Reacciones 👤

Envia un GIF anime para reccionar a lo que quieras.

<details open>
<summary>Comandos</summary>
  
-   #### `/reacciones ehe`

    Ehe te nandayo?!

<br>

-   #### `/reacciones enamorado`

    What is love? Oh baby, don't hurt me.

<br>

-   #### `/reacciones enfado`

    Me enfado y no respiro!

<br>

-   #### `/reacciones llanto`

    Acuéstate => Intenta no llorar => Llora mucho

<br>

-   #### `/reacciones nose`

    No lo sé, tú dime -\_-

<br>

-   #### `/reacciones okey`

    Okey 🐢👍

<br>

-   #### `/reacciones risa`

    kekw

<br>

-   #### `/reacciones sonrisa`

    Smile Sweet Sister Sadistic Surprise Service

<br>

-   #### `/reacciones sonrojarse`

    😳

<br>

-   #### `/reacciones sueño`

    I sleep.... real shi\*!

</details>

---

### Usuarios y Moderación ⚒️

Muestra información sobre un usuario o realiza acciones de modereacción en ellos.

La mayoría de estos comandos son exclusivos para `@⚒️ Administrador/a` y `🛡️ Moderador/a` pero algunos los podéis usar todos.

<details open>
<summary>Comandos</summary>
  
-   #### `/usuario info`

    Muestra la información más importante sobre un usuario como fecha de unión al servidor, fecha de creación de cuenta, nivel, muteos, advertencias, notas...

    | Parámetro | Tipo    | Obligatorio? | Descripción                                |
    | --------- | ------- | :----------: | ------------------------------------------ |
    | `usuario` | Mención | Si           | Usuario del que se mostrará la información |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

<br>

-   #### `Usuario > Aplicaciones > Info`

    Muestra la información más importante sobre un usuario como fecha de unión al servidor, fecha de creación de cuenta, nivel, muteos, advertencias...

<br>

-   #### `/usuario advertencias advertir`

    Añade una advertencia a un usuario. Se le notificará en `#⛔・sanciones`.

    | Parámetro | Tipo    | Obligatorio? | Descripción              |
    | --------- | ------- | :----------: | ------------------------ |
    | `usuario` | Mención |      Si      | Usuario al que advertir  |
    | `motivo`  | Texto   |      Si      | Motivo de la advertencia |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

<br>

-   #### `/usuario advertencias desadvertir`

    Elimina una advertencia de un usuario.

    | Parámetro | Tipo   | Obligatorio? | Descripción                     |
    | --------- | ------ | :----------: | ------------------------------- |
    | `id`      | Número |      Si      | ID de la advertencia a eliminar |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

    > El ID de la advertencia se puede ver con el comando `/usuario info` o `Usuario > Aplicaciones > Info`

<br>

-   #### `/usuario notas añadir`

    Añade una nota a un usuario.

    | Parámetro | Tipo    | Obligatorio? | Descripción                   |
    | --------- | ------- | :----------: | ----------------------------- |
    | `usuario` | Mención |      Si      | Usuario al que añadir la nota |
    | `nota`    | Texto   |      Si      | Nota para dejarle al usuario  |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

    > Solo `@⚒️ Administrador/a` y `🛡️ Moderador/a` podrán ver las notas con .

<br>

-   #### `/usuario notas eliminar`

    Elimina una nota de un usuario.

    | Parámetro | Tipo   | Obligatorio? | Descripción              |
    | --------- | ------ | :----------: | ------------------------ |
    | `id`      | Número |      Si      | ID de la nota a eliminar |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

<br>

-   #### `/usuario muteos mutear`

    Mutea a un usuario. Se le notificará en #⛔・sanciones.

    | Parámetro  | Tipo      | Obligatorio? | Descripción           |
    | ---------- | --------- | :----------: | --------------------- |
    | `usuario`  | Mención   |      Si      | Usuario al que mutear |
    | `duración` | Selección |      Si      | Duración del muteo    |
    | `motivo `  | Texto     |      Si      | Motivo del muteo      |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

<br>

-   #### `/usuario muteos desmutear`

    Desmutea a un usuario. Se le notificará en #⛔・sanciones.

    | Parámetro | Tipo    | Obligatorio? | Descripción              |
    | --------- | ------- | :----------: | ------------------------ |
    | `usuario` | Mención |      Si      | Usuario al que desmutear |
    | `motivo ` | Texto   |      Si      | Motivo del desmuteo      |

    > Exclusivo `@⚒️ Administrador/a` y `🛡️ Moderador/a`.

</details>

<br>

## <p align="center">SOPORTE</p>

-   Si necesitas ayuda con algo relacionado con el bot puedes unirte al [servidor de soporte](https://discord.gg/ZvB55s4) y preguntar en el canal de [ayuda](https://discord.com/channels/726133117722820671/1101792146610196480).
-   Agreadecería que si encuentras algún bug o error lo notificáseis ya que así podré solucionarlo cuanto antes ^^

<br>

## <p align="center">INFORMACIÓN IMPORTANTE SOBRE EL USO DE ESTE CÓDIGO</p>

-   Puedes descargar y usar el código de este bot para lo que desees
-   También puedes usar trozos del código si lo deseas ^^
-   Si usas cualquier parte del código agradecería que añadieras mi cuenta de github, https://github.com/XurxoMF, como créditos o bien en un comentario en el código si solo se usó una parte o bien en la descripción del bot si se usa el código completo.
