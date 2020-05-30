import React, {Fragment}from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useState, useEffect} from "react"

const useStyles = makeStyles((theme) => ({
    button: {
        '& > *': {
          margin: theme.spacing(1),
        },
    },
    table: {
        minWidth: 650,
        
      },
}));

export default function Logbook2() {
    const classes = useStyles();
    const columnsMap = {"time": 0, "SoG": 1, "StW": 2, "cog": 3, "depth": 4, "eventType": 5, "heading":6, "waterTemp": 9, "windDirection":10, "windSpeed": 11 }
    const [data, setData] = useState([{"":""}])
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const result = await axios.get('http://localhost:8080/logbook/event/getMeasurements')
            console.log("result: ", result)
            var columns = result.data[0].columns
            var values = result.data[0].values
            var rows = []
            rows = createLogbookData(columns, values)
            setData(rows)
        }
        fetchData();
        
    },[]);

    function createLogbookData(columns, values) {
        var rows = []
        values.map((row) => {
            rows.push(createLogBookRow(
                row[columnsMap['time']],
                row[columnsMap['eventType']],
                row[columnsMap['depth']],
                row[columnsMap['windSpeed']],
                row[columnsMap['windDirection']],
                row[columnsMap['heading']],
                row[columnsMap['cog']],
                row[columnsMap['StW']],
                row[columnsMap['SoG']],
                row[columnsMap['waterTemp']],
                
            ))
        })
        return rows
    }

    function createLogBookRow(time, eventType, depth, windSpeed, windDirection, heading, cog, StW, SoG, waterTemp) {
        return {time, eventType, depth, windSpeed, windDirection, heading, cog, StW, SoG, waterTemp};
    }

    function onClick(e) {
        let data = {
            value:{
                message: e
            }
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/logbook/event',
            data: data
        })
    }

    function onUpdate() {
        console.log("rerendering")
        setRerender(rerender)
    }

    return (
        
        <Fragment>

            <div className={classes.button}>
                {/* Event buttons */}
                <Typography variant="subtitle1">logbook/events</Typography>
                <Button variant="outlined" onClick={() => onClick("MOB")}>MOB</Button>
                <Button variant="outlined" onClick={() => onClick("FIRE")}>FIRE</Button>
                <Button variant="outlined" onClick={() => onClick("SINKING")}>SINKING</Button>
                <Button variant="outlined" onClick={() => onClick("GROUNDING")}>GROUNDING</Button>
                <Button variant="outlined" onClick={() => onClick("REEFING")}>REEFING</Button>
                <Button variant="outlined" onClick={() => onClick("ANCHORING")}>ANCHORING</Button>
                <Button variant="outlined" onClick={() => onClick("DOCKING")}>DOCKING</Button>
                <Button variant="outlined" onClick={() => onClick("FLOODING")}>FLOODING</Button>
            </div>

            <Divider/>

            <div className={classes.button}>
                {/* Event buttons */}
                <Typography variant="subtitle1">notifications</Typography>
                <Button variant="outlined" onClick={() => onClick("MOB")}>MOB</Button>
                <Button variant="outlined" onClick={() => onClick("FIRE")}>FIRE</Button>
                <Button variant="outlined" onClick={() => onClick("SINKING")}>SINKING</Button>
                <Button variant="outlined" onClick={() => onClick("GROUNDING")}>GROUNDING</Button>
                <Button variant="outlined" onClick={() => onClick("REEFING")}>REEFING</Button>
                <Button variant="outlined" onClick={() => onClick("ANCHORING")}>ANCHORING</Button>
                <Button variant="outlined" onClick={() => onClick("DOCKING")}>DOCKING</Button>
                <Button variant="outlined" onClick={() => onClick("FLOODING")}>FLOODING</Button>
            </div>

            <Divider/>

            <div className={classes.button}>
                <Typography variant="subtitle1">Logbook</Typography>
                <Button variant="contained" onClick={() => onUpdate()}>Update Logbook</Button>
                

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
                        {data.map((row1) => (
                            <TableRow key={row1.time}>
                                <TableCell component="th" scope="row1">{row1.time}</TableCell>
                                <TableCell align="left">{row1.eventType}</TableCell>
                                <TableCell align="left">null</TableCell>
                                <TableCell align="left">{row1.depth}</TableCell>
                                <TableCell align="left">{row1.windSpeed}</TableCell>
                                <TableCell align="left">{row1.windDirection}</TableCell>
                                <TableCell align="left">{row1.heading}</TableCell>
                                <TableCell align="left">{row1.cog}</TableCell>
                                <TableCell align="left">{row1.StW}</TableCell>
                                <TableCell align="left">{row1.SoG}</TableCell>
                                <TableCell align="left">{row1.waterTemp}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
            </div>
        </Fragment>
    )
}
