# Generated by Django 2.2.7 on 2019-11-21 16:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rankdemo', '0008_remove_rank_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rank',
            old_name='score',
            new_name='scores',
        ),
    ]
