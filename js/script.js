       const types = [
            { 1: 'Rostros no coincide' },
            { 2: 'Sin rostro detectable' },
            { 3: 'Lentes' },
            { 4: 'Muchos años de diferencia' },
            { 5: 'Rostro de perfil' },
            { 6: 'Pixeleado' },
            { 7: 'Muy distante' },
            { 8: 'Boca cubierta' },
            { 9: 'Porcentaje insuficiente' },
        ]
        let noMatch = 100;
        let pastel = document.getElementById('graficoGeneral');
        let mostrarDivNoMatch = document.getElementById("divNoMatch");
        const canvasSub = document.getElementById('graficosSubCategoriasGenerales');

        function generarGraficoPastel() {
            let match = cantidadMatch;
            let noMatchValue = resultErrors.length;
            let cantidadTotal = match + noMatchValue;
            const porcentajeMatch = (match / total.length) * 100;
            const porcentajeNoMatch = 100 - porcentajeMatch;

            document.getElementById("porcentaje_match").textContent = `Match: ${porcentajeMatch.toFixed(2)}% - ${match} comparaciones`;
            document.getElementById("porcentaje_no_match").textContent = `No Match: ${porcentajeNoMatch.toFixed(2)}% - ${resultErrors.length} comparaciones`;
            document.getElementById("cantidadTotal").textContent = `Estadisticas basadas en un total de ${cantidadTotal} archivos`;
            // Obtener el contenedor del gráfico y establecer dimensiones
            const container = document.getElementById('primerGrafico');
            container.style.width = "auto";  // Ajusta según tus necesidades
            container.style.height = "auto"; // Ajusta según tus necesidades

            // Obtener el contexto del canvas
            const ctx = document.getElementById('graficoGeneral').getContext('2d');

            // Configuración de datos para el gráfico
            const data = {
                labels: ['Match', 'No Match'],
                datasets: [{
                    data: [porcentajeMatch, porcentajeNoMatch],
                    backgroundColor: ['#00aecc', '#ff7c43'],
                }]
            };

            // Configuración del gráfico
            const options = {
                responsive: false, // Desactivar la opción responsive
                maintainAspectRatio: false, // Desactivar el mantenimiento del aspect ratio
            };

            // Crear el gráfico de pastel con Chart.js
            const myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options,
            });

            // Ocultar el contenedor de esqueleto
            document.getElementById("containerSkeleton").style.display = "none";
        }
    
        function calcularSubCategorias() {
            // Contar la cantidad de cada categoría en el array resultErrors
            const categoryCounts = types.map(type => ({ category: Object.values(type)[0], count: 0 }));

            resultErrors.forEach(value => {
                const categoryIndex = parseInt(value) - 1;
                if (categoryIndex >= 0 && categoryIndex < categoryCounts.length) {
                    categoryCounts[categoryIndex].count++;
                }
            });

            // Calcular el total y ajustar los valores si es necesario
            let total = resultErrors.length;

            if (total > noMatch) {
                const factor = noMatch / total;
                categoryCounts.forEach(categoryCount => {
                    categoryCount.count *= factor;
                });
            }

            noMatch -= total;

            // Crear el objeto de datos para el gráfico
            const data = {
                labels: categoryCounts.map(categoryCount => categoryCount.category),
                datasets: [{
                    data: categoryCounts.map(categoryCount => categoryCount.count),
                    backgroundColor: [
                        '#003f5c', // Gris oscuro (Tipo 1)
                        '#2f4b7c', // Gris medio (Tipo 2)
                        '#665191', // Gris claro (Tipo 3)
                        '#a05195', // Negro (Tipo 4)
                        '#d45087', // Blanco (Tipo 5)
                        '#FF0000', // Rojo (Tipo 7)
                        '#f95d6a', // Azul oscuro (Tipo 6)
                        '#ff7c43', // Azul marino (Tipo 8)
                        '#ffa600'  // Naranja (Tipo 9)                    
                    ]
                }]
            };

            // Configurar y crear el gráfico
            const ctx = canvasSub.getContext('2d');
            const myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data
            });
            canvasSub.setAttribute("data-charged", true)
        }
        function limpiarValores() {
            document.getElementById("cantidad").value = "";
            document.getElementById("match").value = "";
            document.getElementById("noMatch").textContent = "";
            document.getElementById("porcentaje_match").textContent = "";
            document.getElementById("porcentaje_no_match").textContent = "";
            document.getElementById("sinRostroDetectable").value = "";
            document.getElementById("conLentes").value = "";
            document.getElementById("pixeleadas").value = "";
            document.getElementById("rostrosNoCoinciden").value = "";
            document.getElementById("muchosAñosDeDiferencia").value = "";
            document.getElementById("rostroDePerfil").value = "";
            document.getElementById("muyDistante").value = "";
            document.getElementById("bocaCubierta").value = "";
            document.getElementById("porcentajeInsuficiente").value = "";

            // Restablecer el valor de noMatch
            noMatch = 100;
            // Limpiar los gráficos
            limpiarGrafico('graficosSubCategoriasGenerales');
        }
        function limpiarGrafico(idCanvas) {
            let canvas = document.getElementById(idCanvas);
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pastel.style.display = `none`;
            mostrarDivNoMatch.style.display = `none`;
        }
        let resultErrors = [];
        let total = [];
        let cantidadMatch;

        function resta() {
            if (total.length > 0 && resultErrors.length > 0)
                cantidadMatch = total.length - resultErrors.length
            console.log(cantidadMatch)
        }
        function changeTab(tabIndex) {
            // Ocultar todos los contenidos de las pestañas
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            if (tabIndex === 1 && resultErrors.length > 0 && !canvasSub.getAttribute('data-charged')) {
                calcularSubCategorias();
            }
            // Mostrar el contenido de la pestaña seleccionada
            const selectedTabContent = document.getElementById(`tabContent${tabIndex + 1}`);
            if (selectedTabContent) {
                selectedTabContent.style.display = 'block';
            }
        }

        const fetchData = (url, targetArray, columnIndex) => {
            document.getElementById("skeleton").style.display = "block";

            return fetch(url)
                .then(response => response.text())
                .then(csvData => {
                    const lines = csvData.split('\n');
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i];
                        const columns = line.split(',');
                        const value = columns[columnIndex].trim();
                        targetArray.push(value);
                    }
                })
                .catch(error => {
                    console.log(`Error al procesar el CSV desde ${url}:`, error);
                });
        };

        // Crear las promesas
        const promise1 = fetchData('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBSekvE3GURCvGwhxnyx2AWgesh6yxkA0CVxVQwTce04tw_j1bkmRSf1F1LkRMgg/pub?gid=1749451041&single=true&output=csv', resultErrors, 2);
        const promise2 = fetchData('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBSekvE3GURCvGwhxnyx2AWgesh6yxkA0CVxVQwTce04tw_j1bkmRSf1F1LkRMgg/pub?gid=1142218957&single=true&output=csv', total, 1);

        // Ejecutar las promesas con Promise.allSettled
        Promise.allSettled([promise1, promise2])
            .then(results => {
                // Puedes realizar acciones adicionales después de que ambas promesas se completen
                console.log('Promesas completadas:', results);

                // Aquí puedes realizar otras acciones utilizando los datos obtenidos
                console.log('Result Errors:', resultErrors);
                console.log('Total:', total);
                resta()
                generarGraficoPastel()
                changeTab(0)
            });