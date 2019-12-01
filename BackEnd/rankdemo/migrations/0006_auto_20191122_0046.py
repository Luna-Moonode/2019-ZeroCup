# Generated by Django 2.2.7 on 2019-11-21 16:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('rankdemo', '0005_auto_20191122_0043'),
    ]

    operations = [
        migrations.AddField(
            model_name='rank',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='rank',
            name='username',
            field=models.CharField(default='Unknown', max_length=32, unique=True),
        ),
    ]