import React, { Fragment, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  button: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  },
}));

export default function Logbook2() {
  const classes = useStyles();
  const columnsMap = {
    time: 0,
    SoG: 1,
    StW: 2,
    cog: 3,
    depth: 4,
    eventType: 5,
    heading: 6,
    posLat: 7,
    posLong: 8,
    waterTemp: 9,
    windDirection: 10,
    windSpeed: 11,
  };
  const [data, setData] = useState([{ "": "" }]);
  const [alert, setAlert] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(
        "http://localhost:8080/logbook/event/getMeasurements"
      );
      if (result.data === "") {
        setAlert(true);
        return;
      } else {
        setAlert(false);
        console.log("result: ", result);
        var columns = result.data[0].columns;
        var values = result.data[0].values;
        var rows = [];
        rows = createLogbookData(columns, values);
        setData(rows);
      }
    }
    fetchData();
  }, []);

  function createPosition(posLat, posLong) {
    var posLatAsFloat = parseFloat(posLat).toFixed(3);
    var posLongAsFloat = parseFloat(posLong).toFixed(3);
    return posLatAsFloat.toString().concat(", " + posLongAsFloat.toString());
  }

  function createLogbookData(columns, values) {
    var rows = [];
    values.map((row) => {
      /* create position from posLat and posLong */
      var position = createPosition(
        row[columnsMap["posLat"]],
        row[columnsMap["posLong"]]
      );
      rows.push(
        createLogBookRow(
          row[columnsMap["time"]],
          row[columnsMap["eventType"]],
          position,
          row[columnsMap["depth"]],
          parseFloat(row[columnsMap["windSpeed"]]).toFixed(3),
          parseFloat(row[columnsMap["windDirection"]]).toFixed(3),
          parseFloat(row[columnsMap["heading"]]).toFixed(3),
          parseFloat(row[columnsMap["cog"]]).toFixed(3),
          parseFloat(row[columnsMap["StW"]]).toFixed(3),
          parseFloat(row[columnsMap["SoG"]]).toFixed(3),
          parseFloat(row[columnsMap["waterTemp"]]).toFixed(3)
        )
      );
    });
    return rows;
  }

  function createLogBookRow(
    time,
    eventType,
    position,
    depth,
    windSpeed,
    windDirection,
    heading,
    cog,
    StW,
    SoG,
    waterTemp
  ) {
    return {
      time,
      eventType,
      position,
      depth,
      windSpeed,
      windDirection,
      heading,
      cog,
      StW,
      SoG,
      waterTemp,
    };
  }

  function onClickLogbookEvent(eventType) {
    let data = {
      value: {
        message: eventType,
      },
    };
    axios({
      method: "post",
      url: "http://localhost:8080/logbook/event",
      data: data,
    });
  }

  function onClickNotification(eventType) {
    let data = {
      context: "vessels.self",
      updates: [
        {
          values: [
            {
              path: "notifications." + eventType.toLowerCase,
              value: {
                message: eventType,
                state: "emergency",
                method: ["visual", "sound"],
              },
            },
          ],
        },
      ],
    };
    axios({
      method: "post",
      url: "http://localhost:8080/signalk/v1/api/",
      data: data,
    });
  }

    function onUpdate() {
      console.log("here")
    forceUpdate();
  }

  return (
    <Fragment>
      <div className={classes.button}>
        {/* Event buttons */}
        <Typography variant="subtitle1">logbook/events</Typography>
        <Button variant="outlined" onClick={() => onClickLogbookEvent("MOB")}>
          MOB
        </Button>
        <Button variant="outlined" onClick={() => onClickLogbookEvent("FIRE")}>
          FIRE
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("SINKING")}
        >
          SINKING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("GROUNDING")}
        >
          GROUNDING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("REEFING")}
        >
          REEFING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("ANCHORING")}
        >
          ANCHORING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("DOCKING")}
        >
          DOCKING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickLogbookEvent("FLOODING")}
        >
          FLOODING
        </Button>
      </div>

      <Divider />

      <div className={classes.button}>
        {/* Event buttons */}
        <Typography variant="subtitle1">notifications</Typography>
        <Button variant="outlined" onClick={() => onClickNotification("MOB")}>
          MOB
        </Button>
        <Button variant="outlined" onClick={() => onClickNotification("FIRE")}>
          FIRE
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("SINKING")}
        >
          SINKING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("GROUNDING")}
        >
          GROUNDING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("REEFING")}
        >
          REEFING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("ANCHORING")}
        >
          ANCHORING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("DOCKING")}
        >
          DOCKING
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClickNotification("FLOODING")}
        >
          FLOODING
        </Button>
      </div>

      <Divider />

      <div className={classes.button}>
        <Typography variant="subtitle1">Logbook</Typography>
        {alert === true ? (
          <Alert severity="info">
            No measurements found in logbook database
          </Alert>
        ) : null}
        <Button variant="contained" onClick={() => onUpdate()}>
          Update Logbook
        </Button>

        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="left">EventType</TableCell>
                  <TableCell align="left">Position</TableCell>
                  <TableCell align="left">Depth</TableCell>
                  <TableCell align="left">Wind speed</TableCell>
                  <TableCell align="left">Wind direction</TableCell>
                  <TableCell align="left">Heading</TableCell>
                  <TableCell align="left">CoG</TableCell>
                  <TableCell align="left">StW</TableCell>
                  <TableCell align="left">SoG</TableCell>
                  <TableCell align="left">Water temp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.time}>
                    <TableCell component="th" scope="row">
                      {row.time}
                    </TableCell>
                    <TableCell align="left">{row.eventType}</TableCell>
                    <TableCell align="left">{row.position}</TableCell>
                    <TableCell align="left">{row.depth}</TableCell>
                    <TableCell align="left">{row.windSpeed}</TableCell>
                    <TableCell align="left">{row.windDirection}</TableCell>
                    <TableCell align="left">{row.heading}</TableCell>
                    <TableCell align="left">{row.cog}</TableCell>
                    <TableCell align="left">{row.StW}</TableCell>
                    <TableCell align="left">{row.SoG}</TableCell>
                    <TableCell align="left">{row.waterTemp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Fragment>
  );
}
