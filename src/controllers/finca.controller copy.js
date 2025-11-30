// Archivo: /src/controllers/finca.controller.js (Actualizado)

import Finca from '../models/finca.model.js';
import Empresa from '../models/empresa.model.js';

/**
 * @name createFinca
 * @description Crea una nueva finca y la asocia a una Empresa.
 */
export const createFinca = async (req, res) => {
  try {
    const { empresaId } = req.params; 
    // Añadimos tipo_produccion
    const { nombre, area, municipio, departamento, cultivo_principal, tipo_produccion } = req.body;

    if (!nombre || !area) {
      return res.status(400).json({ message: 'Nombre y área son obligatorios' });
    }

    // (Verificación de Permisos - TODO)

    const newFinca = new Finca({
      empresa_owner: empresaId,
      nombre,
      area,
      municipio,
      departamento,
      cultivo_principal,
      tipo_produccion // Añadido
    });
    const savedFinca = await newFinca.save();

    await Empresa.findByIdAndUpdate(empresaId, { $push: { fincas: savedFinca._id } });

    res.status(201).json({ message: 'Finca creada exitosamente', finca: savedFinca });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


/**
 * @name addDivisionPrimaria
 * @description (Antes addZonaToFinca) Añade una división primaria (Zona, Potrero, etc.)
 */
export const addDivisionPrimaria = async (req, res) => {
  try {
    const { fincaId } = req.params;
    const { nombre, imagen } = req.body; // Nombre genérico

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'Finca no encontrada' });
    }

    // (Verificación de Permisos - TODO)

    const nuevaDivision = {
      nombre,
      imagen: imagen || null
    };

    // Usamos $push al array genérico 'divisiones_primarias'
    finca.divisiones_primarias.push(nuevaDivision);
    await finca.save();

    const divisionCreada = finca.divisiones_primarias[finca.divisiones_primarias.length - 1];
    res.status(201).json({ message: 'División Primaria añadida exitosamente', division: divisionCreada });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


/**
 * @name addDivisionSecundaria
 * @description (Antes addLoteToZona) Añade una división secundaria (Lote, Franja, etc.)
 */
export const addDivisionSecundaria = async (req, res) => {
  try {
    // Nuevos params
    const { fincaId, divisionPrimariaId } = req.params;
    const { nombre } = req.body; // Nombre genérico

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'Finca no encontrada' });
    }

    // (Verificación de Permisos - TODO)

    // Buscar la división primaria genérica
    const divisionPrimaria = finca.divisiones_primarias.id(divisionPrimariaId);
    if (!divisionPrimaria) {
      return res.status(404).json({ message: 'División Primaria no encontrada en esta finca' });
    }

    const nuevaDivision = {
      nombre,
    };

    // Usar $push al array genérico 'divisiones_secundarias'
    divisionPrimaria.divisiones_secundarias.push(nuevaDivision);
    await finca.save();

    const divisionCreada = divisionPrimaria.divisiones_secundarias[divisionPrimaria.divisiones_secundarias.length - 1];
    res.status(201).json({ message: 'División Secundaria añadida exitosamente', division: divisionCreada });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};