var sql = require("mssql/msnodesqlv8");

const config = {
  driver: "msnodesqlv8",
  server: "localhost",
  database: "<DB-NAME>",
  options: {
    trustedConnection: true,
    useUTC: true,
  },
};

const getStocks = () => {
  return new Promise((resolve, reject) => {
    sql.connect(config, (err) => {
      if (err) reject(err);
      else {
        const request = new sql.Request();
        request.query("SELECT * FROM Stock", (err, result) => {
          if (err) reject(err);
          else {
            const results = result.recordset;
            resolve(results);
            sql.close((err) => {
              if (err) console.log(err);
              else {
                // console.log("Connection closed successfully");
              }
            });
          }
        });
      }
    });
  });
};

const updateStocks = (
  r010,
  r050,
  r100,
  r200,
  r500,
  r1000,
  c010,
  c100,
  n2000x1,
  n2000x2
) => {
  return new Promise((resolve, reject) => {
    sql.connect(config, (err) => {
      if (err) reject(err);
      else {
        const request = new sql.Request();
        request.query(
          `UPDATE Stock SET numberOfItems=${r010} WHERE denomination=118 UPDATE Stock SET numberOfItems=${r050} WHERE denomination=119 UPDATE Stock SET numberOfItems=${r100} WHERE denomination=120 UPDATE Stock SET numberOfItems=${r200} WHERE denomination=121 UPDATE Stock SET numberOfItems=${r500} WHERE denomination=122 UPDATE Stock SET numberOfItems=${r1000} WHERE denomination=123 UPDATE Stock SET numberOfItems=${c010} WHERE denomination=128 UPDATE Stock SET numberOfItems=${c100} WHERE denomination=130 UPDATE Stock SET numberOfItems=${n2000x1} WHERE denomination=124 AND device=120 UPDATE Stock SET numberOfItems=${n2000x2} WHERE denomination=124 AND device=121`,
          (err, result) => {
            if (err) reject(err);
            else {
              console.log("Successfully updated Stock table!");
              resolve(result);
              sql.close((err) => {
                if (err) console.log(err);
                else {
                  // console.log("Connection closed successfully");
                }
              });
            }
          }
        );
      }
    });
  });
};

module.exports = {
  getStocks: getStocks,
  updateStocks: updateStocks,
};
