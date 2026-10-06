const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate 24-char hex ObjectId
let idCounter = 1000;
function generateObjectId() {
  idCounter++;
  const hexTime = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const hexCounter = idCounter.toString(16).padStart(16, '0');
  return (hexTime + hexCounter).slice(0, 24);
}

// In-Memory Storage
const collections = {
  User: [],
  Technician: [],
  Property: [],
  Equipment: [],
  MaintenanceRequest: [],
  ServiceReport: [],
  Notification: []
};

// Document wrapper
class DocumentInstance {
  constructor(modelName, data) {
    this._modelName = modelName;
    if (!data._id) {
      data._id = generateObjectId();
    }
    Object.assign(this, JSON.parse(JSON.stringify(data)));
    if (!this.createdAt) this.createdAt = new Date();
    if (!this.updatedAt) this.updatedAt = new Date();

    // Bind custom methods
    if (modelName === 'User') {
      this.comparePassword = async function (enteredPassword) {
        if (!this.password) return true;
        // In demo seed / in-memory, compare directly or with bcrypt
        if (this.password === enteredPassword) return true;
        try {
          return await bcrypt.compare(enteredPassword, this.password);
        } catch {
          return false;
        }
      };

      this.getSignedJwtToken = function () {
        return jwt.sign(
          { id: this._id, role: this.role },
          process.env.JWT_SECRET || 'liftcare_default_secret_key',
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
      };
    }
  }

  toObject() {
    const copy = { ...this };
    delete copy._modelName;
    return copy;
  }

  toJSON() {
    return this.toObject();
  }

  async save() {
    this.updatedAt = new Date();
    const list = collections[this._modelName];
    const idx = list.findIndex(d => String(d._id) === String(this._id));
    if (idx >= 0) {
      list[idx] = this;
    } else {
      list.push(this);
    }
    return this;
  }
}

// Query matcher helper
function matchQuery(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, val] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(val)) {
      const orMatched = val.some(subQuery => matchQuery(doc, subQuery));
      if (!orMatched) return false;
      continue;
    }

    const docVal = doc[key];

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (val.$regex) {
        const regex = new RegExp(val.$regex, val.$options || 'i');
        if (!regex.test(String(docVal || ''))) return false;
        continue;
      }
      if (val.$in) {
        const stringArr = val.$in.map(v => String(v));
        if (!stringArr.includes(String(docVal))) return false;
        continue;
      }
      if (val.$nin) {
        const stringArr = val.$nin.map(v => String(v));
        if (stringArr.includes(String(docVal))) return false;
        continue;
      }
    }

    // Direct match (handling ObjectIds or strings)
    if (String(docVal) !== String(val)) {
      return false;
    }
  }

  return true;
}

// Chainable query object
class QueryChain {
  constructor(modelName, results) {
    this._modelName = modelName;
    this._results = results.map(r => new DocumentInstance(modelName, r));
    this._populates = [];
    this._sortObj = null;
    this._limitNum = null;
  }

  populate(pathOrOpts, selectFields) {
    if (typeof pathOrOpts === 'object') {
      this._populates.push(pathOrOpts);
    } else {
      this._populates.push({ path: pathOrOpts, select: selectFields });
    }
    return this;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  limit(num) {
    this._limitNum = num;
    return this;
  }

  select(fields) {
    return this;
  }

  async _execute() {
    let output = [...this._results];

    // Sorting
    if (this._sortObj) {
      const field = Object.keys(this._sortObj)[0];
      const dir = this._sortObj[field];
      output.sort((a, b) => {
        const valA = a[field] || 0;
        const valB = b[field] || 0;
        if (valA < valB) return dir === -1 ? 1 : -1;
        if (valA > valB) return dir === -1 ? -1 : 1;
        return 0;
      });
    }

    // Limit
    if (this._limitNum) {
      output = output.slice(0, this._limitNum);
    }

    // Population
    for (const doc of output) {
      for (const pop of this._populates) {
        const path = pop.path;
        if (path === 'propertyManager' || path === 'user' || path === 'recipient') {
          const targetId = doc[path]?._id || doc[path];
          const userObj = collections.User.find(u => String(u._id) === String(targetId));
          if (userObj) {
            doc[path] = new DocumentInstance('User', userObj);
          }
        } else if (path === 'property') {
          const targetId = doc.property?._id || doc.property;
          const propObj = collections.Property.find(p => String(p._id) === String(targetId));
          if (propObj) {
            doc.property = new DocumentInstance('Property', propObj);
          }
        } else if (path === 'equipment') {
          const targetId = doc.equipment?._id || doc.equipment;
          const equipObj = collections.Equipment.find(e => String(e._id) === String(targetId));
          if (equipObj) {
            doc.equipment = new DocumentInstance('Equipment', equipObj);
          }
        } else if (path === 'assignedTechnician' || path === 'technician') {
          const targetId = doc.assignedTechnician?._id || doc.technician?._id || doc.assignedTechnician || doc.technician;
          const techObj = collections.Technician.find(t => String(t._id) === String(targetId));
          if (techObj) {
            const techInstance = new DocumentInstance('Technician', techObj);
            // Deep populate user
            const uObj = collections.User.find(u => String(u._id) === String(techInstance.user?._id || techInstance.user));
            if (uObj) techInstance.user = new DocumentInstance('User', uObj);
            if (path === 'assignedTechnician') doc.assignedTechnician = techInstance;
            else doc.technician = techInstance;
          }
        } else if (path === 'maintenanceRequest') {
          const targetId = doc.maintenanceRequest?._id || doc.maintenanceRequest;
          const reqObj = collections.MaintenanceRequest.find(r => String(r._id) === String(targetId));
          if (reqObj) {
            doc.maintenanceRequest = new DocumentInstance('MaintenanceRequest', reqObj);
          }
        }
      }
    }

    return output;
  }

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }
}

// In-Memory Model Factory
function createInMemoryModel(modelName) {
  return {
    find(query = {}) {
      const list = collections[modelName] || [];
      const matches = list.filter(d => matchQuery(d, query));
      return new QueryChain(modelName, matches);
    },

    findOne(query = {}) {
      const list = collections[modelName] || [];
      const match = list.find(d => matchQuery(d, query));
      if (!match) {
        const chain = new QueryChain(modelName, []);
        chain._execute = async () => null;
        return chain;
      }
      const chain = new QueryChain(modelName, [match]);
      const origExec = chain._execute.bind(chain);
      chain._execute = async () => {
        const res = await origExec();
        return res[0] || null;
      };
      return chain;
    },

    findById(id) {
      return this.findOne({ _id: id });
    },

    async create(data) {
      if (Array.isArray(data)) {
        const createdList = [];
        for (const item of data) {
          const inst = new DocumentInstance(modelName, item);
          await inst.save();
          createdList.push(inst);
        }
        return createdList;
      }
      const inst = new DocumentInstance(modelName, data);
      await inst.save();
      return inst;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      const list = collections[modelName];
      const idx = list.findIndex(d => String(d._id) === String(id));
      if (idx < 0) return null;
      const current = list[idx].toObject ? list[idx].toObject() : list[idx];
      const merged = { ...current, ...update, updatedAt: new Date() };
      const updatedInst = new DocumentInstance(modelName, merged);
      list[idx] = updatedInst;
      return updatedInst;
    },

    async findByIdAndDelete(id) {
      const list = collections[modelName];
      const idx = list.findIndex(d => String(d._id) === String(id));
      if (idx >= 0) {
        const removed = list.splice(idx, 1)[0];
        return removed;
      }
      return null;
    },

    async deleteMany(query = {}) {
      if (Object.keys(query).length === 0) {
        collections[modelName] = [];
        return { deletedCount: 0 };
      }
      collections[modelName] = collections[modelName].filter(d => !matchQuery(d, query));
      return { deletedCount: 1 };
    },

    async updateMany(query = {}, update = {}) {
      const list = collections[modelName];
      let count = 0;
      for (let i = 0; i < list.length; i++) {
        if (matchQuery(list[i], query)) {
          Object.assign(list[i], update);
          count++;
        }
      }
      return { modifiedCount: count };
    },

    async countDocuments(query = {}) {
      const list = collections[modelName] || [];
      return list.filter(d => matchQuery(d, query)).length;
    },

    async aggregate(pipeline = []) {
      const list = collections[modelName] || [];
      // Simple aggregation for $group: { _id: '$field', count: { $sum: 1 } }
      const groupStage = pipeline.find(p => p.$group);
      if (groupStage) {
        const fieldKey = groupStage.$group._id.replace('$', '');
        const map = {};
        for (const doc of list) {
          const val = doc[fieldKey] || 'Other';
          map[val] = (map[val] || 0) + 1;
        }
        return Object.entries(map).map(([k, v]) => ({ _id: k, count: v }));
      }
      return [];
    }
  };
}

module.exports = {
  createInMemoryModel,
  collections,
  generateObjectId
};
