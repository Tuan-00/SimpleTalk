
from setuptools import setup, find_packages

setup(
    name='SimpleTalk',
    version='0.1dev',
	author='Tuan lima',
    packages=find_packages(),#['simpletalk'],
    license='GNU General Public Licence v3.0',
    description=open('README.md').read(),
    install_requires=[
        'twisted>=18.7.0',
        'autobahn>=17.10.1'
],
)
