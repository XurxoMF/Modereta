# /sofi series lista

Muestra la lista de series coleccionadas por un usuario o si este colecciona una serie en específico.

### Parámetros

{% tabs %}
{% tab title="usuario" %}
**`Tipo:`** @mención

**`Obligatorio?`** :x:

**`Descripción:`** Usuario del que se mostrará la lista o buscará en la misma.

{% hint style="info" %}
Si no se especifica se usará al usuario que ejecutó el comando!

Si se especifíca se usará al usuario mencionado.
{% endhint %}
{% endtab %}

{% tab title="serie" %}
**`Tipo:`** Texto

**`Obligatorio?`** :x:

**`Descripción:`** Serie que se buscará en la lista.

{% hint style="info" %}
Si no se especifica se mostrarán **todas** las series del usuario correspondiente.\
Si se especifica dirá si el usuario colecciona la serie o no.
{% endhint %}

{% hint style="info" %}
Este campo se autocompleta con las series conocidas por Modereta pero se puede añadir cualquier serie aunque no aparezca en la lista, solo se tiene que escribir el nombre completo como aparece en la imagen de arriba.
{% endhint %}
{% endtab %}
{% endtabs %}
